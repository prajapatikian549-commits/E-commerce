package org.example.chatbot.service;

import feign.FeignException;
import org.example.chatbot.client.GeminiClient;
import org.example.chatbot.client.OllamaClient;
import org.example.chatbot.config.ChatbotProperties;
import org.example.chatbot.dto.ChatRequest;
import org.example.chatbot.dto.ChatResponse;
import org.example.chatbot.dto.ReplySource;
import org.example.chatbot.dto.order.OrderApiResponse;
import org.example.chatbot.feign.OrderServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatOrchestrationService {

    private static final Logger log = LoggerFactory.getLogger(ChatOrchestrationService.class);

    private final FaqService faqService;
    private final OrderIntentService orderIntentService;
    private final OrderServiceClient orderServiceClient;
    private final OllamaClient ollamaClient;
    private final GeminiClient geminiClient;
    private final ChatSessionStore sessionStore;
    private final ChatbotProperties properties;

    public ChatOrchestrationService(
            FaqService faqService,
            OrderIntentService orderIntentService,
            OrderServiceClient orderServiceClient,
            OllamaClient ollamaClient,
            GeminiClient geminiClient,
            ChatSessionStore sessionStore,
            ChatbotProperties properties
    ) {
        this.faqService = faqService;
        this.orderIntentService = orderIntentService;
        this.orderServiceClient = orderServiceClient;
        this.ollamaClient = ollamaClient;
        this.geminiClient = geminiClient;
        this.sessionStore = sessionStore;
        this.properties = properties;
    }

    public ChatResponse chat(ChatRequest request) {
        String message = request.message().trim();
        String sessionId = request.sessionId() == null ? "" : request.sessionId().trim();

        return faqService.match(message)
                .map(ans -> finish(sessionId, message, ans, ReplySource.FAQ))
                .or(() -> handleOrderById(message, sessionId))
                .or(() -> handleOrderList(message, sessionId))
                .orElseGet(() -> handleLlm(message, sessionId));
    }

    private Optional<ChatResponse> handleOrderById(String message, String sessionId) {
        Optional<Long> id = orderIntentService.extractOrderId(message);
        if (id.isEmpty()) {
            return Optional.empty();
        }
        Long orderId = id.get();
        try {
            var order = orderServiceClient.getOrder(orderId);
            String text = orderIntentService.formatOrder(order);
            return Optional.of(finish(sessionId, message, text, ReplySource.ORDER_SERVICE));
        } catch (FeignException.NotFound e) {
            String text = "I could not find order #" + orderId + ".";
            return Optional.of(finish(sessionId, message, text, ReplySource.ORDER_SERVICE));
        } catch (FeignException e) {
            log.warn("Order service Feign error status={} for orderId={}", e.status(), orderId);
            return Optional.of(finish(sessionId, message, properties.getFallbackMessage(), ReplySource.FALLBACK));
        }
    }

    private Optional<ChatResponse> handleOrderList(String message, String sessionId) {
        if (!orderIntentService.isListOrdersIntent(message)) {
            return Optional.empty();
        }
        try {
            List<OrderApiResponse> orders = orderServiceClient.listOrders();
            String text = orderIntentService.formatOrderList(orders);
            return Optional.of(finish(sessionId, message, text, ReplySource.ORDER_SERVICE));
        } catch (FeignException e) {
            log.warn("Order service list Feign error status={}", e.status());
            return Optional.of(finish(sessionId, message, properties.getFallbackMessage(), ReplySource.FALLBACK));
        }
    }

    private ChatResponse handleLlm(String message, String sessionId) {
        String prompt = buildLlmPrompt(message, sessionId);

        if (properties.getOllama().isEnabled()) {
            try {
                String reply = ollamaClient.generate(prompt);
                return finish(sessionId, message, reply, ReplySource.OLLAMA);
            } catch (Exception e) {
                log.warn("Ollama generation failed after retries: {}", e.toString());
            }
        } else {
            log.debug("Ollama disabled; skipping local LLM");
        }

        if (geminiClient.isAvailable()) {
            var gemini = geminiClient.generate(prompt);
            if (gemini.isPresent()) {
                return finish(sessionId, message, gemini.get(), ReplySource.GEMINI);
            }
        }

        return finish(sessionId, message, properties.getFallbackMessage(), ReplySource.FALLBACK);
    }

    private String buildLlmPrompt(String userMessage, String sessionId) {
        StringBuilder sb = new StringBuilder();
        sb.append(properties.getSystemPrompt()).append("\n\n");
        for (ChatSessionStore.Turn turn : sessionStore.getRecentTurns(sessionId)) {
            sb.append("User: ").append(turn.user()).append("\n");
            sb.append("Assistant: ").append(turn.assistant()).append("\n");
        }
        sb.append("User: ").append(userMessage).append("\nAssistant:");
        return sb.toString();
    }

    private ChatResponse finish(String sessionId, String userMessage, String reply, ReplySource source) {
        sessionStore.appendTurn(sessionId, userMessage, reply);
        return new ChatResponse(reply, source);
    }
}
