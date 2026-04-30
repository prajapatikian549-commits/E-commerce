package org.example.chatbot.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.LinkedHashMap;
import java.util.Map;

@Validated
@ConfigurationProperties(prefix = "chatbot")
public class ChatbotProperties {

    private final Ollama ollama = new Ollama();
    private final Retry retry = new Retry();
    private final Gemini gemini = new Gemini();
    /**
     * FAQ topic key → answer. Match when the user message contains the key (case-insensitive).
     */
    private Map<String, String> faq = new LinkedHashMap<>();
    private String fallbackMessage =
            "Our assistant is temporarily unavailable. Please try again in a moment.";
    private String systemPrompt =
            "You are a concise, friendly e-commerce store assistant. "
                    + "If you do not know something, say so briefly. Do not invent order numbers or prices.";

    public Ollama getOllama() {
        return ollama;
    }

    public Retry getRetry() {
        return retry;
    }

    public Gemini getGemini() {
        return gemini;
    }

    public Map<String, String> getFaq() {
        return faq;
    }

    public void setFaq(Map<String, String> faq) {
        this.faq = faq != null ? faq : new LinkedHashMap<>();
    }

    public String getFallbackMessage() {
        return fallbackMessage;
    }

    public void setFallbackMessage(String fallbackMessage) {
        this.fallbackMessage = fallbackMessage;
    }

    public String getSystemPrompt() {
        return systemPrompt;
    }

    public void setSystemPrompt(String systemPrompt) {
        this.systemPrompt = systemPrompt;
    }

    public static class Ollama {
        private String baseUrl = "http://localhost:11434";
        private String generatePath = "/api/generate";
        private String model = "llama3";
        private int connectTimeoutMs = 2_000;
        private int readTimeoutMs = 120_000;
        private boolean enabled = true;

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getGeneratePath() {
            return generatePath;
        }

        public void setGeneratePath(String generatePath) {
            this.generatePath = generatePath;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public int getConnectTimeoutMs() {
            return connectTimeoutMs;
        }

        public void setConnectTimeoutMs(int connectTimeoutMs) {
            this.connectTimeoutMs = connectTimeoutMs;
        }

        public int getReadTimeoutMs() {
            return readTimeoutMs;
        }

        public void setReadTimeoutMs(int readTimeoutMs) {
            this.readTimeoutMs = readTimeoutMs;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }

    public static class Retry {
        private int maxAttempts = 3;
        private int waitMs = 500;

        public int getMaxAttempts() {
            return maxAttempts;
        }

        public void setMaxAttempts(int maxAttempts) {
            this.maxAttempts = maxAttempts;
        }

        public int getWaitMs() {
            return waitMs;
        }

        public void setWaitMs(int waitMs) {
            this.waitMs = waitMs;
        }
    }

    public static class Gemini {
        private boolean enabled = false;
        private String baseUrl = "https://generativelanguage.googleapis.com";
        private String model = "gemini-1.5-flash";
        /** Use environment variable in production, e.g. ${GEMINI_API_KEY:} */
        private String apiKey = "";
        private int connectTimeoutMs = 3_000;
        private int readTimeoutMs = 60_000;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public int getConnectTimeoutMs() {
            return connectTimeoutMs;
        }

        public void setConnectTimeoutMs(int connectTimeoutMs) {
            this.connectTimeoutMs = connectTimeoutMs;
        }

        public int getReadTimeoutMs() {
            return readTimeoutMs;
        }

        public void setReadTimeoutMs(int readTimeoutMs) {
            this.readTimeoutMs = readTimeoutMs;
        }

        public boolean isConfigured() {
            return enabled && apiKey != null && !apiKey.isBlank();
        }
    }
}
