package com.example.ecommerce.controller;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        Cart cart = cartService.getOrCreateCart(user);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            Authentication authentication,
            @RequestBody Map<String, Object> payload
    ) {
        User user = getCurrentUser(authentication);
        Long productId = Long.parseLong(payload.get("productId").toString());
        String productName = (String) payload.get("productName");
        String productImage = (String) payload.get("productImage");
        Double price = Double.parseDouble(payload.get("price").toString());
        Integer quantity = Integer.parseInt(payload.get("quantity").toString());

        Cart updatedCart = cartService.addToCart(user, productId, productName, productImage, price, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/update-quantity")
    public ResponseEntity<Cart> updateQuantity(
            Authentication authentication,
            @RequestBody Map<String, Object> payload
    ) {
        User user = getCurrentUser(authentication);
        Long productId = Long.parseLong(payload.get("productId").toString());
        Integer quantity = Integer.parseInt(payload.get("quantity").toString());

        Cart updatedCart = cartService.updateCartItemQuantity(user, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            Authentication authentication,
            @PathVariable Long productId
    ) {
        User user = getCurrentUser(authentication);
        Cart updatedCart = cartService.removeFromCart(user, productId);
        return ResponseEntity.ok(updatedCart);
    }

    @PostMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }
} 