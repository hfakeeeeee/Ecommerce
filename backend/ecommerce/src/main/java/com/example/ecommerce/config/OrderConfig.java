package com.example.ecommerce.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "order.automation")
public class OrderConfig {
    
    private int pendingToProcessingSeconds = 30;
    private int processingToShippedSeconds = 60;
    private int shippedToDeliveredSeconds = 90;
    private int schedulerIntervalSeconds = 10;
    
    public int getPendingToProcessingSeconds() {
        return pendingToProcessingSeconds;
    }
    
    public void setPendingToProcessingSeconds(int pendingToProcessingSeconds) {
        this.pendingToProcessingSeconds = pendingToProcessingSeconds;
    }
    
    public int getProcessingToShippedSeconds() {
        return processingToShippedSeconds;
    }
    
    public void setProcessingToShippedSeconds(int processingToShippedSeconds) {
        this.processingToShippedSeconds = processingToShippedSeconds;
    }
    
    public int getShippedToDeliveredSeconds() {
        return shippedToDeliveredSeconds;
    }
    
    public void setShippedToDeliveredSeconds(int shippedToDeliveredSeconds) {
        this.shippedToDeliveredSeconds = shippedToDeliveredSeconds;
    }
    
    public int getSchedulerIntervalSeconds() {
        return schedulerIntervalSeconds;
    }
    
    public void setSchedulerIntervalSeconds(int schedulerIntervalSeconds) {
        this.schedulerIntervalSeconds = schedulerIntervalSeconds;
    }
} 