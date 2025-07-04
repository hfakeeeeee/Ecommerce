package com.example.ecommerce.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Log the request details
            logger.info("Processing request: {} {}", request.getMethod(), request.getRequestURI());
            
            String jwt = parseJwt(request);
            logger.info("JWT Token present: {}", jwt != null);

            if (jwt != null) {
                logger.info("Validating token...");
                boolean isValid = jwtUtils.validateToken(jwt);
                logger.info("Token validation result: {}", isValid);

                if (isValid) {
                    String username = jwtUtils.getUsernameFromToken(jwt);
                    logger.info("Username from token: {}", username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (userDetails != null) {
                        logger.info("User details loaded successfully for: {}", username);
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.info("Authentication set in SecurityContext for user: {}", username);
                    } else {
                        logger.error("UserDetails not found for username: {}", username);
                    }
                } else {
                    logger.error("Token validation failed");
                }
            } else {
                logger.info("No JWT token found in request");
            }
        } catch (Exception e) {
            logger.error("Authentication error: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        logger.info("Authorization header present: {}", headerAuth != null);
        
        if (headerAuth != null) {
            logger.info("Authorization header starts with 'Bearer ': {}", headerAuth.startsWith("Bearer "));
            if (headerAuth.startsWith("Bearer ")) {
                String token = headerAuth.substring(7);
                logger.info("Extracted token length: {}", token.length());
                return token;
            }
        }

        return null;
    }
} 