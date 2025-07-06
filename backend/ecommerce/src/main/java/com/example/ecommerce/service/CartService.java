package com.example.ecommerce.service;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductService productService;

    public CartService(CartRepository cartRepository, ProductService productService) {
        this.cartRepository = cartRepository;
        this.productService = productService;
    }

    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findLatestByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addToCart(User user, Long productId, String productName, String productImage, Double price, Integer quantity) {
        // Validate stock availability before adding to cart
        if (!productService.isStockAvailable(productId, quantity)) {
            throw new RuntimeException("Insufficient stock for product: " + productName);
        }
        
        Cart cart = getOrCreateCart(user);
        
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            // Check if the new total quantity is available
            if (!productService.isStockAvailable(productId, item.getQuantity() + quantity)) {
                throw new RuntimeException("Insufficient stock for product: " + productName);
            }
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductId(productId);
            newItem.setProductName(productName);
            newItem.setProductImage(productImage);
            newItem.setPrice(price);
            newItem.setQuantity(quantity);
            cart.addItem(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItemQuantity(User user, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(user);
        
        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantity <= 0) {
                        cart.removeItem(item);
                    } else {
                        // Validate stock availability for new quantity
                        if (!productService.isStockAvailable(productId, quantity)) {
                            throw new RuntimeException("Insufficient stock for product: " + item.getProductName());
                        }
                        item.setQuantity(quantity);
                    }
                });

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(User user, Long productId) {
        Cart cart = getOrCreateCart(user);
        
        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresent(cart::removeItem);

        return cartRepository.save(cart);
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public Cart getCart(User user) {
        return getOrCreateCart(user);
    }
} 