package com.example.ecommerce.service;

import com.example.ecommerce.config.OrderConfig;
import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderConfig orderConfig;
    private final ProductService productService;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, OrderConfig orderConfig, ProductService productService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderConfig = orderConfig;
        this.productService = productService;
    }

    @Transactional
    public Order createOrder(Order order) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderNumber(generateOrderNumber());
        order.setStatus("PENDING");
        
        return orderRepository.save(order);
    }

    public List<Order> getCurrentUserOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public List<Order> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    @Transactional
    public Order updateOrderStatus(String orderNumber, String newStatus) {
        Order order = orderRepository.findByOrderNumber(orderNumber);
        if (order == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }

        // Validate the status transition
        String currentStatus = order.getStatus();
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status transition");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatusByAdmin(String orderNumber, String newStatus) {
        Order order = orderRepository.findByOrderNumber(orderNumber);
        if (order == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }

        String currentStatus = order.getStatus();
        
        // If changing from a non-cancelled status to cancelled, restore stock
        if (!"CANCELLED".equals(currentStatus) && "CANCELLED".equals(newStatus)) {
            restoreStockForOrder(order);
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }

        // Check if enough time has passed for the status transition
        LocalDateTime minimumTransitionTime = calculateMinimumTransitionTime(order, currentStatus, newStatus);
        if (minimumTransitionTime != null && order.getOrderDate().isAfter(minimumTransitionTime)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Cannot update status yet. Please wait for the minimum processing time."
            );
        }

        // Admin can set any valid status
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Invalid status transition from " + currentStatus + " to " + newStatus
            );
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber);
        if (order == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }

        // Only allow cancellation of PENDING orders
        if (!"PENDING".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending orders can be cancelled");
        }

        // Verify the user owns this order
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to cancel this order");
        }

        // Restore stock for cancelled order
        restoreStockForOrder(order);

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    private void restoreStockForOrder(Order order) {
        if (order.getItems() != null) {
            for (var item : order.getItems()) {
                try {
                    productService.restoreStock(item.getProductId(), item.getQuantity());
                } catch (Exception e) {
                    // Log the error but don't fail the cancellation
                    System.err.println("Failed to restore stock for product " + item.getProductId() + ": " + e.getMessage());
                }
            }
        }
    }

    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        if (currentStatus == null || newStatus == null) {
            return false;
        }

        switch (currentStatus.toUpperCase()) {
            case "PENDING":
                return newStatus.equals("PROCESSING") || newStatus.equals("CANCELLED");
            case "PROCESSING":
                return newStatus.equals("SHIPPED") || newStatus.equals("CANCELLED");
            case "SHIPPED":
                return newStatus.equals("DELIVERED");
            case "DELIVERED":
            case "CANCELLED":
                return false; // Terminal states
            default:
                return false;
        }
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    // Automated status update methods
    @Transactional
    public void processPendingOrders() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusSeconds(orderConfig.getPendingToProcessingSeconds());
        List<Order> pendingOrders = orderRepository.findPendingOrdersReadyForProcessing(cutoffTime);
        
        for (Order order : pendingOrders) {
            order.setStatus("PROCESSING");
            orderRepository.save(order);
        }
    }
    
    @Transactional
    public void processProcessingOrders() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusSeconds(
            orderConfig.getPendingToProcessingSeconds() + orderConfig.getProcessingToShippedSeconds()
        );
        List<Order> processingOrders = orderRepository.findProcessingOrdersReadyForShipping(cutoffTime);
        
        for (Order order : processingOrders) {
            order.setStatus("SHIPPED");
            orderRepository.save(order);
        }
    }
    
    @Transactional
    public void processShippedOrders() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusSeconds(
            orderConfig.getPendingToProcessingSeconds() + 
            orderConfig.getProcessingToShippedSeconds() + 
            orderConfig.getShippedToDeliveredSeconds()
        );
        List<Order> shippedOrders = orderRepository.findShippedOrdersReadyForDelivery(cutoffTime);
        
        for (Order order : shippedOrders) {
            order.setStatus("DELIVERED");
            orderRepository.save(order);
        }
    }

    private LocalDateTime calculateMinimumTransitionTime(Order order, String currentStatus, String newStatus) {
        if (currentStatus == null || newStatus == null || order.getOrderDate() == null) {
            return null;
        }

        LocalDateTime orderDate = order.getOrderDate();
        
        // Calculate the minimum time that should have passed based on the status transition
        switch (currentStatus.toUpperCase()) {
            case "PENDING":
                if ("PROCESSING".equals(newStatus)) {
                    return orderDate.plusSeconds(orderConfig.getPendingToProcessingSeconds());
                }
                break;
            case "PROCESSING":
                if ("SHIPPED".equals(newStatus)) {
                    return orderDate.plusSeconds(
                        orderConfig.getPendingToProcessingSeconds() + 
                        orderConfig.getProcessingToShippedSeconds()
                    );
                }
                break;
            case "SHIPPED":
                if ("DELIVERED".equals(newStatus)) {
                    return orderDate.plusSeconds(
                        orderConfig.getPendingToProcessingSeconds() + 
                        orderConfig.getProcessingToShippedSeconds() + 
                        orderConfig.getShippedToDeliveredSeconds()
                    );
                }
                break;
        }
        
        return null;
    }
} 