package com.example.ecommerce.controller;

import com.example.ecommerce.model.ChatMessage;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "You must be logged in to use the chat feature",
                "code", "UNAUTHORIZED"
            ));
        }

        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Message cannot be empty",
                "code", "INVALID_MESSAGE"
            ));
        }

        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "User not found in database",
                    "code", "USER_NOT_FOUND"
                ));
            }
            ChatMessage userMessage = chatService.saveUserMessage(message, user);
            ChatMessage botResponse = chatService.generateBotResponse(message, user);
            
            return ResponseEntity.ok(Map.of(
                "userMessage", userMessage,
                "botResponse", botResponse
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to process chat message",
                "code", "INTERNAL_ERROR"
            ));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "You must be logged in to view chat history",
                "code", "UNAUTHORIZED"
            ));
        }

        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "User not found in database",
                    "code", "USER_NOT_FOUND"
                ));
            }
            List<ChatMessage> history = chatService.getChatHistory(user);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to fetch chat history",
                "code", "INTERNAL_ERROR"
            ));
        }
    }
} 