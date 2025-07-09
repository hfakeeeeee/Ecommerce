package com.example.ecommerce.controller;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.model.UserFavorite;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.UserFavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class UserFavoriteController {
    private final UserFavoriteService userFavoriteService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public UserFavoriteController(
            UserFavoriteService userFavoriteService,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.userFavoriteService = userFavoriteService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<List<UserFavorite>> getFavorites(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<UserFavorite> favorites = userFavoriteService.getUserFavorites(user);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(
            Authentication authentication,
            @RequestBody Map<String, Long> payload) {
        User user = getCurrentUser(authentication);
        Product product = productRepository.findById(payload.get("productId"))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        userFavoriteService.addFavorite(user, product);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFavorite(
            Authentication authentication,
            @PathVariable Long productId) {
        User user = getCurrentUser(authentication);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        userFavoriteService.removeFavorite(user, product);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> checkFavorite(
            Authentication authentication,
            @PathVariable Long productId) {
        User user = getCurrentUser(authentication);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean isFavorite = userFavoriteService.isFavorite(user, product);
        return ResponseEntity.ok(isFavorite);
    }

    // Test endpoint to manually trigger price checks (admin only)
    @PostMapping("/check-prices")
    public ResponseEntity<?> checkPrices(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).body("Admin access required");
        }
        
        userFavoriteService.checkPriceChanges();
        return ResponseEntity.ok().body("Price check triggered successfully");
    }
} 