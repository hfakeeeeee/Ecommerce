package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.OrderItem;
import com.example.ecommerce.model.User;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final OrderService orderService;
    private final ProductService productService;
    private final JavaMailSender emailSender;

    public PaymentService(OrderService orderService, ProductService productService, JavaMailSender emailSender) {
        this.orderService = orderService;
        this.productService = productService;
        this.emailSender = emailSender;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String createPaymentIntent(Map<String, Object> payload, User user) throws StripeException {
        // Extract amount from payload
        Double amount = Double.parseDouble(payload.get("amount").toString());
        
        // Validate stock availability before creating payment intent
        validateStockAvailability(payload);
        
        // Create payment intent parameters
        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount.longValue()); // amount in cents
        params.put("currency", "usd");
        params.put("payment_method_types", java.util.Arrays.asList("card"));
        
        // Create payment intent
        PaymentIntent paymentIntent = PaymentIntent.create(params);
        
        return paymentIntent.getClientSecret();
    }

    @Transactional
    public void handleSuccessfulPayment(String paymentIntentId, Map<String, Object> payload, User user) {
        try {
            // Quick check if order already exists
            if (orderService.findByPaymentIntentId(paymentIntentId) != null) {
                return; // Silently return if order already exists
            }

            // Create order without waiting for email
            createOrder(payload, paymentIntentId, Double.parseDouble(payload.get("amount").toString()) / 100.0, user);
        } catch (Exception e) {
            logger.error("Error processing order after payment: {}", e.getMessage());
            // Don't throw exception since payment was successful
        }
    }

    private void validateStockAvailability(Map<String, Object> payload) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        if (items != null) {
            for (Map<String, Object> item : items) {
                Long productId = Long.parseLong(item.get("id").toString());
                Integer quantity = Integer.parseInt(item.get("quantity").toString());
                
                if (!productService.isStockAvailable(productId, quantity)) {
                    throw new RuntimeException("Insufficient stock for product ID: " + productId);
                }
            }
        }
    }

    @Transactional
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

        // Add order items and reduce stock
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) payload.get("items");
        if (items != null) {
            for (Map<String, Object> item : items) {
                OrderItem orderItem = new OrderItem();
                Long productId = Long.parseLong(item.get("id").toString());
                Integer quantity = Integer.parseInt(item.get("quantity").toString());
                
                orderItem.setProductId(productId);
                orderItem.setProductName((String) item.get("name"));
                orderItem.setPrice(Double.parseDouble(item.get("price").toString()));
                orderItem.setQuantity(quantity);
                orderItem.setProductImage((String) item.get("image"));
                order.getItems().add(orderItem);
                
                // Reduce stock for this product
                productService.reduceStock(productId, quantity);
            }
        }

        Order savedOrder = orderService.createOrder(order);

        // Send email in a new thread
        new Thread(() -> {
            try {
                sendOrderConfirmationEmailAsync(savedOrder, user);
            } catch (Exception e) {
                logger.error("Failed to send order confirmation email: {}", e.getMessage());
            }
        }).start();
    }

    @Async
    void sendOrderConfirmationEmailAsync(Order order, User user) {
        try {
            logger.info("Starting async email sending for order: {}", order.getOrderNumber());
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Order Confirmation - Order #" + order.getOrderNumber());

            StringBuilder emailContent = new StringBuilder();
            emailContent.append("<html><body>");
            emailContent.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>");
            
            // Header
            emailContent.append("<div style='background-color: #4F46E5; color: white; padding: 20px; text-align: center;'>");
            emailContent.append("<h1 style='margin: 0;'>Order Confirmation</h1>");
            emailContent.append("</div>");

            // Order Details
            emailContent.append("<div style='padding: 20px;'>");
            emailContent.append("<h2>Thank you for your order!</h2>");
            emailContent.append("<p>Dear ").append(user.getFirstName()).append(" ").append(user.getLastName()).append(",</p>");
            emailContent.append("<p>Your order has been successfully placed. Here are your order details:</p>");
            
            // Order Info
            emailContent.append("<div style='background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px;'>");
            emailContent.append("<p><strong>Order Number:</strong> ").append(order.getOrderNumber()).append("</p>");
            emailContent.append("<p><strong>Order Date:</strong> ").append(
                order.getOrderDate() != null 
                    ? new SimpleDateFormat("MMMM dd, yyyy").format(java.sql.Timestamp.valueOf(order.getOrderDate()))
                    : "N/A"
            ).append("</p>");
            emailContent.append("<p><strong>Order Status:</strong> ").append(order.getStatus()).append("</p>");
            emailContent.append("</div>");

            // Shipping Address
            emailContent.append("<div style='margin: 20px 0;'>");
            emailContent.append("<h3>Shipping Address:</h3>");
            emailContent.append("<p style='white-space: pre-line;'>").append(order.getShippingAddress()).append("</p>");
            emailContent.append("</div>");

            // Order Items
            emailContent.append("<h3>Order Items:</h3>");
            emailContent.append("<table style='width: 100%; border-collapse: collapse; margin-top: 10px;'>");
            emailContent.append("<tr style='background-color: #f8f9fa;'>");
            emailContent.append("<th style='padding: 10px; text-align: left; border: 1px solid #dee2e6;'>Product</th>");
            emailContent.append("<th style='padding: 10px; text-align: center; border: 1px solid #dee2e6;'>Quantity</th>");
            emailContent.append("<th style='padding: 10px; text-align: right; border: 1px solid #dee2e6;'>Price</th>");
            emailContent.append("<th style='padding: 10px; text-align: right; border: 1px solid #dee2e6;'>Total</th>");
            emailContent.append("</tr>");

            for (OrderItem item : order.getItems()) {
                emailContent.append("<tr>");
                emailContent.append("<td style='padding: 10px; border: 1px solid #dee2e6;'>").append(item.getProductName()).append("</td>");
                emailContent.append("<td style='padding: 10px; text-align: center; border: 1px solid #dee2e6;'>").append(item.getQuantity()).append("</td>");
                emailContent.append("<td style='padding: 10px; text-align: right; border: 1px solid #dee2e6;'>$").append(String.format("%.2f", item.getPrice())).append("</td>");
                emailContent.append("<td style='padding: 10px; text-align: right; border: 1px solid #dee2e6;'>$").append(String.format("%.2f", item.getPrice() * item.getQuantity())).append("</td>");
                emailContent.append("</tr>");
            }

            // Total
            emailContent.append("<tr style='background-color: #f8f9fa;'>");
            emailContent.append("<td colspan='3' style='padding: 10px; text-align: right; border: 1px solid #dee2e6;'><strong>Total Amount:</strong></td>");
            emailContent.append("<td style='padding: 10px; text-align: right; border: 1px solid #dee2e6;'><strong>$").append(String.format("%.2f", order.getTotalAmount())).append("</strong></td>");
            emailContent.append("</tr>");
            emailContent.append("</table>");

            // Footer
            emailContent.append("<div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;'>");
            emailContent.append("<p>If you have any questions about your order, please contact our customer support.</p>");
            emailContent.append("<p>Thank you for shopping with us!</p>");
            emailContent.append("</div>");

            emailContent.append("</div>");
            emailContent.append("</body></html>");

            helper.setText(emailContent.toString(), true);
            emailSender.send(message);
            logger.info("Successfully sent confirmation email for order: {}", order.getOrderNumber());
        } catch (MessagingException e) {
            logger.error("Failed to send order confirmation email for order {}: {}", 
                order.getOrderNumber(), e.getMessage());
        }
    }
} 