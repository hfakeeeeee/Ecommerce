package com.example.ecommerce.controller;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders() {
        return ResponseEntity.ok(orderService.getCurrentUserOrders());
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByNumber(orderNumber));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @PutMapping("/{orderNumber}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        Order updatedOrder = orderService.updateOrderStatus(orderNumber, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/admin/{orderNumber}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatusByAdmin(
            @PathVariable String orderNumber,
            @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        Order updatedOrder = orderService.updateOrderStatusByAdmin(orderNumber, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable String orderNumber) {
        Order cancelledOrder = orderService.cancelOrder(orderNumber);
        return ResponseEntity.ok(cancelledOrder);
    }
    
    // Manual trigger for testing order automation (admin only)
    @PostMapping("/admin/trigger-automation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> triggerOrderAutomation() {
        orderService.processPendingOrders();
        orderService.processProcessingOrders();
        orderService.processShippedOrders();
        return ResponseEntity.ok(Map.of("message", "Order automation triggered successfully"));
    }
} 