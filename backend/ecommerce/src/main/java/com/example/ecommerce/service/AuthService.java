package com.example.ecommerce.service;

import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.RegisterRequest;
import com.example.ecommerce.dto.ResetPasswordRequest;
import com.example.ecommerce.dto.UpdateProfileRequest;
import com.example.ecommerce.dto.CompleteResetRequest;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final JavaMailSender emailSender;
    private final Map<String, String> resetTokens = new HashMap<>();

    @Value("${app.upload.dir:${user.home}}")
    private String uploadDir;

    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      AuthenticationManager authenticationManager,
                      JwtUtils jwtUtils,
                      JavaMailSender emailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.emailSender = emailSender;
    }

    public ResponseEntity<?> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already taken"));
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    public ResponseEntity<Map<String, String>> login(LoginRequest request) {
        try {
            // First, check if user exists
            User user = userRepository.findByEmail(request.getEmail());
            if (user == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(response);
            }

            // Attempt authentication
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Set security context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails);

            // Prepare response
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("email", user.getEmail());
            response.put("imageUrl", user.getImageUrl() != null ? user.getImageUrl() : "");

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(401).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "An error occurred during login: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    public ResponseEntity<?> verifyToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername());
            return ResponseEntity.ok(Map.of(
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "imageUrl", user.getImageUrl() != null ? user.getImageUrl() : ""
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid token"));
    }

    public ResponseEntity<?> resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        String token = UUID.randomUUID().toString();
        resetTokens.put(token, user.getEmail());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText(
            "Hello " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
            "You have requested to reset your password. Click the link below to reset your password:\n\n" +
            "http://localhost:5173/forgot-password?token=" + token + "\n\n" +
            "If you did not request this password reset, please ignore this email.\n\n" +
            "This link will expire in 30 minutes for security reasons.\n\n" +
            "Best regards,\n" +
            "Your Application Team"
        );
        emailSender.send(message);

        return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
    }

    public ResponseEntity<?> completeReset(CompleteResetRequest request) {
        String email = resetTokens.get(request.getToken());
        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired token"));
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        resetTokens.remove(request.getToken());

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }

    public ResponseEntity<?> updateProfile(UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Not authenticated"));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already taken"));
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
            "message", "Profile updated successfully",
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "email", user.getEmail(),
            "imageUrl", user.getImageUrl() != null ? user.getImageUrl() : ""
        ));
    }

    public ResponseEntity<?> uploadAvatar(MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Not authenticated"));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername());

        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir, "avatars");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            String imageUrl = "/api/uploads/avatars/" + fileName;
            user.setImageUrl(imageUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message", "Avatar uploaded successfully",
                "imageUrl", imageUrl
            ));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to upload avatar"));
        }
    }

    public ResponseEntity<?> changePassword(String currentPassword, String newPassword) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Not authenticated"));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
} 