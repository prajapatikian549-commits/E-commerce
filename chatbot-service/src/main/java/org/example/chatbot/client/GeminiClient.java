package org.example.chatbot.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.chatbot.config.ChatbotProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@Service
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    private final WebClient geminiWebClient;
    private final ChatbotProperties properties;
    private final ObjectMapper objectMapper;

    public GeminiClient(WebClient geminiWebClient,
                        ChatbotProperties properties,
                        ObjectMapper objectMapper) {
        this.geminiWebClient = geminiWebClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public boolean isAvailable() {
        return properties.getGemini().isConfigured();
    }

    /**
     * Optional fallback when Ollama is unavailable. Requires {@code chatbot.gemini.enabled=true}
     * and a non-blank {@code chatbot.gemini.api-key} (typically from {@code GEMINI_API_KEY}).
     */
    public Optional<String> generate(String prompt) {
        var g = properties.getGemini();
        if (!g.isConfigured()) {
            return Optional.empty();
        }
        String path = "/v1beta/models/" + g.getModel() + ":generateContent";
        Map<String, Object> body = Map.of(
                "contents", java.util.List.of(
                        Map.of("parts", java.util.List.of(Map.of("text", prompt))))
        );
        try {
            String raw = geminiWebClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path(path)
                            .queryParam("key", g.getApiKey())
                            .build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofMillis(g.getReadTimeoutMs()))
                    .block();
            if (raw == null || raw.isBlank()) {
                return Optional.empty();
            }
            JsonNode root = objectMapper.readTree(raw);
            JsonNode text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            if (text.isMissingNode() || text.asText().isBlank()) {
                log.warn("Gemini response missing text");
                return Optional.empty();
            }
            return Optional.of(text.asText().trim());
        } catch (WebClientResponseException e) {
            log.warn("Gemini HTTP error: {} {}", e.getStatusCode().value(), e.getStatusText());
            return Optional.empty();
        } catch (Exception e) {
            log.warn("Gemini call failed: {}", e.toString());
            return Optional.empty();
        }
    }
}
