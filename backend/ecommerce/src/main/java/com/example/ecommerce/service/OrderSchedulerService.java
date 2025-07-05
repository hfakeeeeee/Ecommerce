package com.example.ecommerce.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class OrderSchedulerService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderSchedulerService.class);
    
    private final OrderService orderService;
    
    @Autowired
    public OrderSchedulerService(OrderService orderService) {
        this.orderService = orderService;
    }
    
    // Run every configured interval to check for pending orders that need to be processed
    @Scheduled(fixedRateString = "#{@orderConfig.schedulerIntervalSeconds * 1000}")
    public void schedulePendingToProcessing() {
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
        try {
            logger.info("Checking for shipped orders to deliver...");
            orderService.processShippedOrders();
        } catch (Exception e) {
            logger.error("Error processing orders for delivery: ", e);
        }
    }
} 