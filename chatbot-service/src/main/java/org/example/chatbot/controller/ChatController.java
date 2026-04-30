package org.example.chatbot.controller;

import jakarta.validation.Valid;
import org.example.chatbot.dto.ChatRequest;
import org.example.chatbot.dto.ChatResponse;
import org.example.chatbot.service.ChatOrchestrationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatOrchestrationService chatOrchestrationService;

    public ChatController(ChatOrchestrationService chatOrchestrationService) {
        this.chatOrchestrationService = chatOrchestrationService;
    }

    @PostMapping
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return chatOrchestrationService.chat(request);
    }
}
