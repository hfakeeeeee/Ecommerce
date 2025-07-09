package com.example.ecommerce.service;

import com.example.ecommerce.model.UserFavorite;
import com.example.ecommerce.model.User;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.UserFavoriteRepository;
import com.example.ecommerce.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserFavoriteService {
    private static final Logger logger = LoggerFactory.getLogger(UserFavoriteService.class);
    
    private final UserFavoriteRepository userFavoriteRepository;
    private final ProductRepository productRepository;
    private final JavaMailSender emailSender;

    @Autowired
    public UserFavoriteService(
            UserFavoriteRepository userFavoriteRepository,
            ProductRepository productRepository,
            JavaMailSender emailSender) {
        this.userFavoriteRepository = userFavoriteRepository;
        this.productRepository = productRepository;
        this.emailSender = emailSender;
    }

    @Transactional
    public void addFavorite(User user, Product product) {
        if (!userFavoriteRepository.existsByUserAndProduct(user, product)) {
            UserFavorite favorite = new UserFavorite();
            favorite.setUser(user);
            favorite.setProduct(product);
            favorite.setLastNotifiedPrice(product.getPrice().doubleValue());
            userFavoriteRepository.save(favorite);
            logger.info("Added new favorite for user {} and product {}", user.getEmail(), product.getName());
        }
    }

    @Transactional
    public void removeFavorite(User user, Product product) {
        userFavoriteRepository.deleteByUserAndProduct(user, product);
        logger.info("Removed favorite for user {} and product {}", user.getEmail(), product.getName());
    }

    public List<UserFavorite> getUserFavorites(User user) {
        return userFavoriteRepository.findByUser(user);
    }

    public boolean isFavorite(User user, Product product) {
        return userFavoriteRepository.existsByUserAndProduct(user, product);
    }

    @Scheduled(fixedRate = 30000) // Check every minute (60000 milliseconds)
    @Transactional
    public void checkPriceChanges() {
        logger.info("Starting scheduled price check for favorites");
        List<UserFavorite> allFavorites = userFavoriteRepository.findAll();
        logger.info("Found {} favorites to check", allFavorites.size());
        
        for (UserFavorite favorite : allFavorites) {
            try {
                Optional<Product> currentProduct = productRepository.findById(favorite.getProduct().getId());
                if (!currentProduct.isPresent()) {
                    logger.warn("Product {} no longer exists", favorite.getProduct().getId());
                    continue;
                }
                
                Product product = currentProduct.get();
                Double currentPrice = product.getPrice().doubleValue();
                Double lastNotifiedPrice = favorite.getLastNotifiedPrice();
                
                logger.debug("Checking product {} - Current price: {}, Last notified price: {}", 
                    product.getName(), currentPrice, lastNotifiedPrice);
                
                if (lastNotifiedPrice != null && currentPrice < lastNotifiedPrice) {
                    // Price has decreased
                    logger.info("Price decrease detected for product {} - Old: {}, New: {}", 
                        product.getName(), lastNotifiedPrice, currentPrice);
                    sendPriceChangeNotification(favorite, currentPrice, lastNotifiedPrice);
                    favorite.setLastNotifiedPrice(currentPrice);
                    userFavoriteRepository.save(favorite);
                }
            } catch (Exception e) {
                logger.error("Error checking price for favorite {}: {}", favorite.getId(), e.getMessage(), e);
            }
        }
        logger.info("Completed scheduled price check for favorites");
    }

    private void sendPriceChangeNotification(UserFavorite favorite, Double newPrice, Double oldPrice) {
        User user = favorite.getUser();
        Product product = favorite.getProduct();
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Price Drop Alert for " + product.getName());
            message.setText(String.format(
                "Good news! The price of %s has dropped from $%.2f to $%.2f.\n\n" +
                "Visit our website to check it out!",
                product.getName(),
                oldPrice,
                newPrice
            ));
            
            emailSender.send(message);
            logger.info("Sent price drop notification to {} for product {}", user.getEmail(), product.getName());
        } catch (Exception e) {
            logger.error("Failed to send price drop notification to {} for product {}: {}", 
                user.getEmail(), product.getName(), e.getMessage(), e);
        }
    }
} 