package com.example.ecommerce.controller;

import com.example.ecommerce.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:5173", "http://192.168.76.75:5173", "http://localhost:80"}, allowCredentials = "true")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStatistics() {
        return ResponseEntity.ok(analyticsService.getDashboardStatistics());
    }

    @GetMapping("/orders-by-month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getOrdersByMonth() {
        return ResponseEntity.ok(analyticsService.getOrdersByMonth());
    }
} 