package com.example.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:${user.home}}")
    private String uploadDir;

    @Value("${CORS_ADDITIONAL_ORIGINS:http://localhost:80,http://127.0.0.1:80}")
    private String additionalOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        List<String> allowedOrigins = new ArrayList<>();
        allowedOrigins.add("http://localhost:80");
        allowedOrigins.add("http://localhost:3000");
        allowedOrigins.add("http://localhost:5173");
        
        // Add additional origins from configuration
        for (String origin : additionalOrigins.split(",")) {
            String trimmedOrigin = origin.trim();
            if (!trimmedOrigin.isEmpty()) {
                allowedOrigins.add(trimmedOrigin);
            }
        }

        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir, "uploads");
        String uploadAbsolutePath = uploadPath.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadAbsolutePath + "/")
                .setCachePeriod(3600)
                .resourceChain(true);
    }
} 