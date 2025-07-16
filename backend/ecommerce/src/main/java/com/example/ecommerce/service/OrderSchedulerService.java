package com.example.ecommerce.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.ecommerce.config.OrderConfig;

@Service
public class OrderSchedulerService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderSchedulerService.class);
    
    private final OrderService orderService;
    private final OrderConfig orderConfig;
    
    @Autowired
    public OrderSchedulerService(OrderService orderService, OrderConfig orderConfig) {
        this.orderService = orderService;
        this.orderConfig = orderConfig;
    }
    
    // Run every configured interval to check for pending orders that need to be processed
    @Scheduled(fixedRateString = "#{@orderConfig.schedulerIntervalSeconds * 1000}")
    public void schedulePendingToProcessing() {
        if (!orderConfig.isAutoModeEnabled()) {
            logger.debug("Auto mode is disabled, skipping pending orders processing");
            return;
        }
        try {
            logger.info("Checking for pending orders to process...");
            orderService.processPendingOrders();
        } catch (Exception e) {
            logger.error("Error processing pending orders: ", e);
        }
    }
    
    // Run every configured interval to check for processing orders that need to be shipped
    @Scheduled(fixedRateString = "#{@orderConfig.schedulerIntervalSeconds * 1000}")
    public void scheduleProcessingToShipped() {
        if (!orderConfig.isAutoModeEnabled()) {
            logger.debug("Auto mode is disabled, skipping processing orders to shipped");
            return;
        }
        try {
            logger.info("Checking for processing orders to ship...");
            orderService.processProcessingOrders();
        } catch (Exception e) {
            logger.error("Error processing orders for shipping: ", e);
        }
    }
    
    // Run every configured interval to check for shipped orders that need to be delivered
    @Scheduled(fixedRateString = "#{@orderConfig.schedulerIntervalSeconds * 1000}")
    public void scheduleShippedToDelivered() {
        if (!orderConfig.isAutoModeEnabled()) {
            logger.debug("Auto mode is disabled, skipping shipped orders to delivered");
            return;
        }
        try {
            logger.info("Checking for shipped orders to deliver...");
            orderService.processShippedOrders();
        } catch (Exception e) {
            logger.error("Error processing orders for delivery: ", e);
        }
    }
} 