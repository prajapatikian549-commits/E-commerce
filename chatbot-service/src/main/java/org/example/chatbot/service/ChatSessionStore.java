package org.example.chatbot.service;

import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatSessionStore {

    private static final int MAX_TURNS = 5;

    private final ConcurrentHashMap<String, Deque<Turn>> sessions = new ConcurrentHashMap<>();

    public record Turn(String user, String assistant) {
    }

    public List<Turn> getRecentTurns(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            return List.of();
        }
        Deque<Turn> deque = sessions.get(sessionId.trim());
        if (deque == null || deque.isEmpty()) {
            return List.of();
        }
        return new ArrayList<>(deque);
    }

    public void appendTurn(String sessionId, String userMessage, String assistantMessage) {
        if (sessionId == null || sessionId.isBlank()) {
            return;
        }
        String key = sessionId.trim();
        sessions.compute(key, (k, existing) -> {
            Deque<Turn> deque = existing != null ? existing : new ArrayDeque<>();
            deque.addLast(new Turn(userMessage, assistantMessage));
            while (deque.size() > MAX_TURNS) {
                deque.removeFirst();
            }
            return deque;
        });
    }
}
