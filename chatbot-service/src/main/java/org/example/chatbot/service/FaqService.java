package org.example.chatbot.service;

import org.example.chatbot.config.ChatbotProperties;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FaqService {

    private final ChatbotProperties properties;

    public FaqService(ChatbotProperties properties) {
        this.properties = properties;
    }

    /**
     * Returns a predefined answer when the message contains a configured FAQ key (longer keys first).
     */
    public Optional<String> match(String message) {
        String lower = message.toLowerCase();
        List<Map.Entry<String, String>> entries = new ArrayList<>(properties.getFaq().entrySet());
        entries.sort(Comparator.comparingInt((Map.Entry<String, String> e) -> e.getKey().length()).reversed());
        for (Map.Entry<String, String> e : entries) {
            if (e.getKey() != null && lower.contains(e.getKey().toLowerCase())) {
                return Optional.of(e.getValue());
            }
        }
        return Optional.empty();
    }
}
