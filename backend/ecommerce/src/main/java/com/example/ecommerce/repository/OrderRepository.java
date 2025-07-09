package com.example.ecommerce.repository;

import com.example.ecommerce.model.Order;
import com.example.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
    Order findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByOrderDateDesc();
    
    // Find orders that need status updates
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' AND o.orderDate <= :cutoffTime")
    List<Order> findPendingOrdersReadyForProcessing(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'PROCESSING' AND o.orderDate <= :cutoffTime")
    List<Order> findProcessingOrdersReadyForShipping(@Param("cutoffTime") LocalDateTime cutoffTime);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'SHIPPED' AND o.orderDate <= :cutoffTime")
    List<Order> findShippedOrdersReadyForDelivery(@Param("cutoffTime") LocalDateTime cutoffTime);

    List<Order> findByUser_Id(Long userId);
    List<Order> findByOrderDateAfter(LocalDateTime date);
} 