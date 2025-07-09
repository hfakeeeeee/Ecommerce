package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Total orders
        long totalOrders = orderRepository.count();
        statistics.put("totalOrders", totalOrders);

        // Total users
        long totalUsers = userRepository.count();
        statistics.put("totalUsers", totalUsers);

        // Total products
        long totalProducts = productRepository.count();
        statistics.put("totalProducts", totalProducts);

        // Recent orders (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Order> recentOrders = orderRepository.findByOrderDateAfter(thirtyDaysAgo);
        statistics.put("recentOrders", recentOrders.size());

        // Calculate total revenue
        double totalRevenue = recentOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
        statistics.put("totalRevenue", totalRevenue);

        return statistics;
    }

    public Map<String, Long> getOrdersByMonth() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Order> orders = orderRepository.findByOrderDateAfter(sixMonthsAgo);
        
        Map<String, Long> ordersByMonth = new HashMap<>();
        orders.forEach(order -> {
            String monthYear = order.getOrderDate().getMonth().toString() + " " + 
                             order.getOrderDate().getYear();
            ordersByMonth.merge(monthYear, 1L, Long::sum);
        });
        
        return ordersByMonth;
    }
} 