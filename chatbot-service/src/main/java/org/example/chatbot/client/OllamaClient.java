package org.example.chatbot.client;

import org.example.chatbot.client.ollama.OllamaGenerateRequest;
import org.example.chatbot.client.ollama.OllamaGenerateResponse;
import org.example.chatbot.config.ChatbotProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.netty.http.client.PrematureCloseException;

import java.time.Duration;

@Service
public class OllamaClient {

    private static final Logger log = LoggerFactory.getLogger(OllamaClient.class);

    private final WebClient ollamaWebClient;
    private final ChatbotProperties properties;

    public OllamaClient(WebClient ollamaWebClient,
                        ChatbotProperties properties) {
        this.ollamaWebClient = ollamaWebClient;
        this.properties = properties;
    }

    /**
     * Calls Ollama /api/generate with configured timeouts; retries transient failures.
     */
    @Retryable(
            retryFor = {
                    WebClientRequestException.class,
                    WebClientResponseException.ServiceUnavailable.class,
                    WebClientResponseException.InternalServerError.class,
                    WebClientResponseException.BadGateway.class,
                    WebClientResponseException.GatewayTimeout.class,
                    PrematureCloseException.class
            },
            maxAttemptsExpression = "${chatbot.retry.max-attempts:3}",
            backoff = @Backoff(delayExpression = "${chatbot.retry.wait-ms:500}")
    )
    public String generate(String prompt) {
        var o = properties.getOllama();
        if (!o.isEnabled()) {
            throw new IllegalStateException("Ollama integration is disabled");
        }
        OllamaGenerateRequest body = new OllamaGenerateRequest(o.getModel(), prompt, false);
        OllamaGenerateResponse parsed = ollamaWebClient.post()
                .uri(o.getGeneratePath())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(OllamaGenerateResponse.class)
                .timeout(Duration.ofMillis(o.getReadTimeoutMs()))
                .block();
        if (parsed == null || parsed.response() == null || parsed.response().isBlank()) {
            log.warn("Ollama returned empty response body");
            throw new IllegalStateException("Empty Ollama response");
        }
        return parsed.response().trim();
    }
}
