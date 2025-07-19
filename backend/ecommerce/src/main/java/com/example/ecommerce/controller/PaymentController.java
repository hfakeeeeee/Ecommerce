package com.example.ecommerce.controller;

import com.example.ecommerce.model.User;
import com.example.ecommerce.service.PaymentService;
import com.example.ecommerce.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public PaymentController(PaymentService paymentService, UserRepository userRepository) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> payload) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                logger.error("No authentication found");
                return ResponseEntity.badRequest().body(Map.of("error", "Not authenticated"));
            }

            String email = authentication.getName();
            logger.info("Creating payment intent for user: {}", email);

            User user = userRepository.findByEmail(email);
            if (user == null) {
                logger.error("User not found for email: {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            String clientSecret = paymentService.createPaymentIntent(payload, user);
            return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
        } catch (Exception e) {
            logger.error("Error creating payment intent", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/payment-success")
    public ResponseEntity<?> handlePaymentSuccess(@RequestBody Map<String, Object> payload) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                logger.error("No authentication found");
                return ResponseEntity.badRequest().body(Map.of("error", "Not authenticated"));
            }

            String email = authentication.getName();
            logger.info("Processing successful payment for user: {}", email);

            User user = userRepository.findByEmail(email);
            if (user == null) {
                logger.error("User not found for email: {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            String paymentIntentId = (String) payload.get("paymentIntentId");
            if (paymentIntentId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Payment intent ID is required"));
            }

            paymentService.handleSuccessfulPayment(paymentIntentId, payload, user);
            return ResponseEntity.ok(Map.of("message", "Payment processed successfully"));
        } catch (Exception e) {
            logger.error("Error processing payment success", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 