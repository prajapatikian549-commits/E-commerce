package org.example.chatbot.client.ollama;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OllamaGenerateRequest(
        @JsonProperty("model") String model,
        @JsonProperty("prompt") String prompt,
        @JsonProperty("stream") boolean stream
) {
}
