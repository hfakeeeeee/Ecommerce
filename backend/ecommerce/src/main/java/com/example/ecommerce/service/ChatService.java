package com.example.ecommerce.service;

import com.example.ecommerce.model.ChatMessage;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.ChatMessageRepository;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ProductRepository productRepository;

    // Store conversation context for each user
    private final Map<Long, ConversationContext> userContexts = new HashMap<>();

    private static class ConversationContext {
        String lastTopic;
        List<Product> lastSearchResults;
        int resultPage = 0;
        LocalDateTime lastInteraction;

        ConversationContext() {
            this.lastInteraction = LocalDateTime.now();
        }
    }

    public ChatMessage saveUserMessage(String message, User user) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setMessage(message);
        chatMessage.setUser(user);
        chatMessage.setUserMessage(true);
        chatMessage.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(chatMessage);
    }

    public ChatMessage generateBotResponse(String userMessage, User user) {
        String botResponse;
        userMessage = userMessage.toLowerCase();
        
        // Get or create user context
        ConversationContext context = userContexts.computeIfAbsent(user.getId(), k -> new ConversationContext());
        
        // Check if the context is too old (more than 30 minutes)
        if (context.lastInteraction != null && 
            context.lastInteraction.plusMinutes(30).isBefore(LocalDateTime.now())) {
            context = new ConversationContext();
            userContexts.put(user.getId(), context);
        }
        
        // Update last interaction time
        context.lastInteraction = LocalDateTime.now();

        // Handle follow-up questions about products
        if (context.lastTopic != null && context.lastTopic.equals("product_search") && 
            (userMessage.contains("more") || userMessage.contains("next") || userMessage.contains("show more"))) {
            botResponse = showMoreProducts(context);
        }
        // Handle price-related follow-ups
        else if (context.lastTopic != null && context.lastTopic.equals("product_search") && 
                 (userMessage.contains("price") || userMessage.contains("cost") || userMessage.contains("how much"))) {
            botResponse = handlePriceQuery(userMessage, context);
        }
        // Handle new product search
        else if (userMessage.contains("search") || userMessage.contains("find") || 
                 userMessage.contains("looking for") || userMessage.contains("show me")) {
            botResponse = handleProductSearch(userMessage, context);
            context.lastTopic = "product_search";
        }
        // Handle shipping questions
        else if (userMessage.contains("shipping") || userMessage.contains("delivery")) {
            botResponse = handleShippingQuery(userMessage);
            context.lastTopic = "shipping";
        }
        // Handle return policy questions
        else if (userMessage.contains("return") || userMessage.contains("refund")) {
            botResponse = handleReturnQuery(userMessage);
            context.lastTopic = "returns";
        }
        // Handle greetings
        else if (isGreeting(userMessage)) {
            botResponse = generateGreeting(user.getFirstName());
            context.lastTopic = "greeting";
        }
        // Handle goodbyes
        else if (isGoodbye(userMessage)) {
            botResponse = generateGoodbye(user.getFirstName());
            context.lastTopic = "goodbye";
        }
        // Handle general help request
        else if (userMessage.contains("help") || userMessage.contains("support")) {
            botResponse = generateHelpResponse();
            context.lastTopic = "help";
        }
        // Handle thank you messages
        else if (userMessage.contains("thank") || userMessage.contains("thanks")) {
            botResponse = handleThankYou();
            // Keep the last topic as is to maintain context
        }
        else {
            botResponse = generateFallbackResponse(context.lastTopic);
        }
        
        ChatMessage botMessage = new ChatMessage();
        botMessage.setMessage(botResponse);
        botMessage.setUser(user);
        botMessage.setUserMessage(false);
        botMessage.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(botMessage);
    }

    private String handleProductSearch(String userMessage, ConversationContext context) {
        // Extract search terms by removing common words
        String[] wordsToIgnore = {
            "search", "find", "looking", "for", "product", "item", "a", "an", "the",
            "please", "can", "you", "help", "me", "show", "want", "need", "would", "like"
        };
        String searchQuery = userMessage;
        for (String word : wordsToIgnore) {
            searchQuery = searchQuery.replaceAll("\\b" + word + "\\b", "").trim();
        }

        if (searchQuery.isEmpty()) {
            return "I'd be happy to help you find a product! Could you tell me what kind of product you're interested in?";
        }

        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            searchQuery, searchQuery);

        if (products.isEmpty()) {
            return String.format(
                "I couldn't find any products matching '%s'. Would you like to:\n" +
                "- Try a different search term\n" +
                "- Browse our featured products\n" +
                "- Get help from our support team",
                searchQuery
            );
        }

        // Store results in context
        context.lastSearchResults = products;
        context.resultPage = 0;

        return formatProductResults(products, 0);
    }

    private String showMoreProducts(ConversationContext context) {
        if (context.lastSearchResults == null || context.lastSearchResults.isEmpty()) {
            return "I don't have any active product search results. Would you like to search for something specific?";
        }

        context.resultPage++;
        return formatProductResults(context.lastSearchResults, context.resultPage);
    }

    private String formatProductResults(List<Product> products, int page) {
        int startIndex = page * 5;
        if (startIndex >= products.size()) {
            return "That's all the products I found. Would you like to try a different search?";
        }

        StringBuilder response = new StringBuilder();
        if (page == 0) {
            response.append("🎉 **Found some great products for you!**\n\n");
        } else {
            response.append("📦 **Here are more products:**\n\n");
        }

        products.stream()
            .skip(startIndex)
            .limit(5)
            .forEach(product -> {
                response.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                response.append("🛍️ **").append(product.getName()).append("**\n");
                response.append("💰 **Price:** $").append(String.format("%.2f", product.getPrice())).append("\n");
                response.append("📸 **Image:** ").append(product.getImage()).append("\n");
                response.append("🔗 **View Product:** /product/").append(product.getId()).append("\n");
                response.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            });

        int remaining = products.size() - (startIndex + 5);
        if (remaining > 0) {
            response.append("\n✨ **Found ").append(remaining).append(" more products!**\n");
            response.append("💡 *Say \"show more\" to see them, or ask about specific product details!*");
        } else {
            response.append("\n🎯 *Click on any product link above to view full details!*");
        }

        return response.toString();
    }

    private String handlePriceQuery(String userMessage, ConversationContext context) {
        if (context.lastSearchResults == null || context.lastSearchResults.isEmpty()) {
            return "Which product would you like to know the price of? You can search for specific products and I'll help you find their prices.";
        }

        return "I've shown you some products with their prices above. Would you like to:\n" +
               "- See more products\n" +
               "- Search for a specific product\n" +
               "- Learn about our pricing policies or discounts";
    }

    private String handleShippingQuery(String userMessage) {
        if (userMessage.contains("time") || userMessage.contains("long") || userMessage.contains("when")) {
            return "Our shipping times are:\n" +
                   "📦 Standard Shipping: 3-5 business days\n" +
                   "🚀 Express Shipping: 1-2 business days\n\n" +
                   "Would you like to know about shipping costs or tracking your order?";
        } else if (userMessage.contains("cost") || userMessage.contains("price") || userMessage.contains("fee")) {
            return "Our shipping rates are:\n" +
                   "📦 Standard Shipping: Free for orders over $50\n" +
                   "🚀 Express Shipping: $15 flat rate\n\n" +
                   "Would you like to know about delivery times or tracking your order?";
        } else if (userMessage.contains("track")) {
            return "Once your order ships, you'll receive a tracking number via email. You can track your package:\n" +
                   "1. From your order history\n" +
                   "2. Using the tracking number in your email\n\n" +
                   "Need help finding your tracking number?";
        }
        
        return "I can help you with shipping! Would you like to know about:\n" +
               "- Delivery times\n" +
               "- Shipping costs\n" +
               "- Order tracking\n" +
               "Just let me know what interests you!";
    }

    private String handleReturnQuery(String userMessage) {
        if (userMessage.contains("how") || userMessage.contains("process")) {
            return "Here's how to return an item:\n" +
                   "1. Initiate return from your order history\n" +
                   "2. Print the provided return label\n" +
                   "3. Pack the item securely\n" +
                   "4. Drop off at any shipping location\n\n" +
                   "Would you like more details about any of these steps?";
        } else if (userMessage.contains("long") || userMessage.contains("days")) {
            return "Our return window is 30 days from delivery for most items. Some exceptions:\n" +
                   "- Opened electronics: 14 days\n" +
                   "- Defective items: 90 days\n" +
                   "- Gift returns: 45 days\n\n" +
                   "Need to start a return?";
        }

        return "We have a hassle-free 30-day return policy! Would you like to know about:\n" +
               "- How to return an item\n" +
               "- Return window timeframes\n" +
               "- Refund processing\n" +
               "Just ask me about any of these topics!";
    }

    private boolean isGreeting(String message) {
        String[] greetings = {"hello", "hi", "hey", "good morning", "good afternoon", "good evening", "howdy"};
        return Arrays.stream(greetings).anyMatch(message::contains);
    }

    private String generateGreeting(String firstName) {
        String[] greetings = {
            "Hi %s! How can I help you today? 😊",
            "Hello %s! What brings you here today?",
            "Hey %s! I'm here to help. What can I do for you?",
            "Welcome %s! How may I assist you today?"
        };
        return String.format(greetings[new Random().nextInt(greetings.length)], firstName);
    }

    private boolean isGoodbye(String message) {
        String[] goodbyes = {"bye", "goodbye", "see you", "talk to you later", "have a good"};
        return Arrays.stream(goodbyes).anyMatch(message::contains);
    }

    private String generateGoodbye(String firstName) {
        String[] goodbyes = {
            "Goodbye %s! Have a great day! 👋",
            "Take care %s! Feel free to come back if you need anything else!",
            "Bye %s! Thanks for chatting with me! 😊",
            "See you later %s! Don't hesitate to reach out if you need more help!"
        };
        return String.format(goodbyes[new Random().nextInt(goodbyes.length)], firstName);
    }

    private String handleThankYou() {
        String[] responses = {
            "You're welcome! Is there anything else you'd like to know? 😊",
            "Happy to help! Let me know if you need anything else!",
            "Anytime! Don't hesitate to ask if you have more questions!",
            "My pleasure! Is there something else I can help you with?"
        };
        return responses[new Random().nextInt(responses.length)];
    }

    private String generateHelpResponse() {
        return "I'm here to help! I can assist you with:\n" +
               "🔍 Finding products\n" +
               "💰 Checking prices\n" +
               "📦 Shipping information\n" +
               "↩️ Return policy\n" +
               "❓ General questions\n\n" +
               "What would you like to know about?";
    }

    private String generateFallbackResponse(String lastTopic) {
        if (lastTopic == null) {
            return "I'm not quite sure what you're asking. Would you like to:\n" +
                   "- Search for products\n" +
                   "- Learn about shipping\n" +
                   "- Know about returns\n" +
                   "- Get help with something else";
        }

        switch (lastTopic) {
            case "product_search":
                return "Would you like to:\n" +
                       "- Search for different products\n" +
                       "- Get more details about specific products\n" +
                       "- Learn about pricing or availability";
            case "shipping":
                return "I can tell you more about:\n" +
                       "- Shipping times\n" +
                       "- Shipping costs\n" +
                       "- Order tracking\n" +
                       "What interests you?";
            case "returns":
                return "I can help you understand:\n" +
                       "- Return process\n" +
                       "- Return timeframes\n" +
                       "- Refund policy\n" +
                       "What would you like to know?";
            default:
                return "I'm here to help! Would you like to:\n" +
                       "- Find products\n" +
                       "- Learn about shipping\n" +
                       "- Understand our return policy\n" +
                       "Just let me know!";
        }
    }

    public List<ChatMessage> getChatHistory(User user) {
        return chatMessageRepository.findByUserOrderByTimestampAsc(user);
    }
} 