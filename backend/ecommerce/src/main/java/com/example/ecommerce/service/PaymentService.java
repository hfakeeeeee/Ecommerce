package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.User;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final OrderService orderService;

    public PaymentService(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String createPaymentIntent(Map<String, Object> payload, User user) throws StripeException {
        // Extract amount from payload
        Double amount = Double.parseDouble(payload.get("amount").toString());
        
        // Create payment intent parameters
        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount.longValue()); // amount in cents
        params.put("currency", "usd");
        params.put("payment_method_types", java.util.Arrays.asList("card"));
        
        // Create payment intent
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Create order
        createOrder(payload, paymentIntent.getId(), amount / 100.0, user); // Convert cents back to dollars
        
        return paymentIntent.getClientSecret();
    }

    private void createOrder(Map<String, Object> payload, String paymentIntentId, Double totalAmount, User user) {
        Order order = new Order();
        order.setPaymentIntentId(paymentIntentId);
        order.setTotalAmount(totalAmount);
        order.setUser(user);

        // Set shipping address
        @SuppressWarnings("unchecked")
        Map<String, String> shipping = (Map<String, String>) payload.get("shipping");
        String shippingAddress = String.format("%s %s\n%s\n%s, %s %s\n%s",
            shipping.get("firstName"),
            shipping.get("lastName"),
            shipping.get("address"),
            shipping.get("city"),
            shipping.get("state"),
            shipping.get("zipCode"),
            shipping.get("country")
        );
        order.setShippingAddress(shippingAddress);

        // Add order items
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        if (items != null) {
            for (Map<String, Object> item : items) {
                OrderItem orderItem = new OrderItem();
                orderItem.setProductId(Long.parseLong(item.get("id").toString()));
                orderItem.setProductName((String) item.get("name"));
                orderItem.setPrice(Double.parseDouble(item.get("price").toString()));
                orderItem.setQuantity(Integer.parseInt(item.get("quantity").toString()));
                orderItem.setProductImage((String) item.get("image"));
                order.getItems().add(orderItem);
            }
        }

        orderService.createOrder(order);
    }
} 