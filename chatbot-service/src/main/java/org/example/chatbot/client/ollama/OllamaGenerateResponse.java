package org.example.chatbot.client.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OllamaGenerateResponse(String response) {
}
