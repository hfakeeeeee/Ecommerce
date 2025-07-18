package com.example.ecommerce.service;

import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.RegisterRequest;
import com.example.ecommerce.dto.ResetPasswordRequest;
import com.example.ecommerce.dto.UpdateProfileRequest;
import com.example.ecommerce.dto.CompleteResetRequest;
import com.example.ecommerce.model.User;
import com.example.ecommerce.model.PasswordResetToken;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.repository.PasswordResetTokenRepository;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final JavaMailSender emailSender;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${app.upload.dir:/app/uploads}")
    private String uploadDir;

    @Value("${frontend.url}")
    private String frontend_host;

    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      AuthenticationManager authenticationManager,
                      JwtUtils jwtUtils,
                      JavaMailSender emailSender,
                      PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.emailSender = emailSender;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public ResponseEntity<?> register(RegisterRequest request) {
        try {
            // Validate email format
            if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Please enter a valid email address"));
            }

            // Check if email exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("message", "This email is already registered"));
            }

            // Validate password
            if (request.getPassword().length() < 8) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters long"));
            }
            if (!request.getPassword().matches(".*[A-Z].*")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one uppercase letter"));
            }
            if (!request.getPassword().matches(".*[a-z].*")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one lowercase letter"));
            }
            if (!request.getPassword().matches(".*[0-9].*")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one number"));
            }
            if (!request.getPassword().matches(".*[!@#$%^&*].*")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one special character (!@#$%^&*)"));
            }

            // Validate name fields
            if (request.getFirstName().length() < 2) {
                return ResponseEntity.badRequest().body(Map.of("message", "First name must be at least 2 characters long"));
            }
            if (request.getLastName().length() < 2) {
                return ResponseEntity.badRequest().body(Map.of("message", "Last name must be at least 2 characters long"));
            }
            if (!request.getFirstName().matches("^[\\p{L}\\s-']+$")) {
                return ResponseEntity.badRequest().body(Map.of("message", "First name can only contain letters, spaces, hyphens and apostrophes"));
            }
            if (!request.getLastName().matches("^[\\p{L}\\s-']+$")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Last name can only contain letters, spaces, hyphens and apostrophes"));
            }

            User user = new User();
            user.setFirstName(request.getFirstName().trim());
            user.setLastName(request.getLastName().trim());
            user.setEmail(request.getEmail().toLowerCase().trim());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.USER);

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Registration successful! You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "An error occurred during registration. Please try again."));
        }
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

            // Check if avatar file exists, if not, reset to default
            if (user.getImageUrl() != null && !user.getImageUrl().isEmpty()) {
                Path avatarPath = Paths.get(uploadDir, user.getImageUrl().replaceFirst("/uploads/?", "uploads/"));
                if (!Files.exists(avatarPath)) {
                    user.setImageUrl(""); // Reset to default (empty string means default)
                    userRepository.save(user);
                }
            }

            // Attempt authentication
            try {
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
                response.put("role", user.getRole().toString());

                return ResponseEntity.ok(response);
            } catch (Exception e) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "An error occurred during login. Please try again.");
            return ResponseEntity.status(500).body(response);
        }
    }

    public ResponseEntity<?> verifyToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername());
            // Check if avatar file exists, if not, reset to default
            if (user.getImageUrl() != null && !user.getImageUrl().isEmpty()) {
                Path avatarPath = Paths.get(uploadDir, user.getImageUrl().replaceFirst("/uploads/?", "uploads/"));
                if (!Files.exists(avatarPath)) {
                    user.setImageUrl(""); // Reset to default (empty string means default)
                    userRepository.save(user);
                }
            }
            return ResponseEntity.ok(Map.of(
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "imageUrl", user.getImageUrl() != null ? user.getImageUrl() : "",
                "role", user.getRole().toString()
            ));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid token"));
    }

    @Transactional
    public ResponseEntity<?> resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        // Delete any existing tokens for this email
        passwordResetTokenRepository.deleteByEmail(request.getEmail());

        // Create new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(user.getEmail());
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        passwordResetTokenRepository.save(resetToken);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText(
            "Hello " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
            "You have requested to reset your password. Click the link below to reset your password:\n\n" +
            frontend_host + "/forgot-password?token=" + token + "\n\n" +
            "If you did not request this password reset, please ignore this email.\n\n" +
            "This link will expire in 30 minutes for security reasons.\n\n" +
            "Best regards,\n" +
            "Your Application Team"
        );
        emailSender.send(message);

        return ResponseEntity.ok(Map.of("message", "Password reset email sent"));
    }

    @Transactional
    public ResponseEntity<?> completeReset(CompleteResetRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken());
        if (resetToken == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired token"));
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body(Map.of("message", "Token has expired"));
        }

        User user = userRepository.findByEmail(resetToken.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }

    @Transactional
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
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, "uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update user's imageUrl - use the correct path that matches WebConfig
            String imageUrl = "/uploads/" + filename;
            user.setImageUrl(imageUrl);
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    public ResponseEntity<?> changePassword(String currentPassword, String newPassword) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Not authenticated"));
        }

        // Validate new password
        if (newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 8 characters long"));
        }
        if (!newPassword.matches(".*[A-Z].*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one uppercase letter"));
        }
        if (!newPassword.matches(".*[a-z].*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one lowercase letter"));
        }
        if (!newPassword.matches(".*[0-9].*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one number"));
        }
        if (!newPassword.matches(".*[!@#$%^&*].*")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least one special character (!@#$%^&*)"));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Current password is incorrect"));
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password must be different from current password"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    // ADMIN: Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ADMIN: Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // ADMIN: Update user role
    @Transactional
    public boolean updateUserRole(Long id, String role) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                user.setRole(User.Role.valueOf(role));
                userRepository.save(user);
                return true;
            } catch (IllegalArgumentException e) {
                return false;
            }
        }
        return false;
    }

    // ADMIN: Reset user password (set to default and email user)
    @Transactional
    public boolean resetUserPassword(Long id, String defaultPassword) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(defaultPassword));
            userRepository.save(user);
            // Optionally, email the user about the reset
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getEmail());
                message.setSubject("Your password has been reset");
                message.setText("Hello " + user.getFirstName() + ",\n\nYour password has been reset by an admin. Your new password is: " + defaultPassword + "\nPlease log in and change it as soon as possible.\n\nBest regards,\nAdmin Team");
                emailSender.send(message);
            } catch (Exception e) {
                // Ignore email errors for now
            }
            return true;
        }
        return false;
    }

    // ADMIN: Update user by admin
    @Transactional
    public ResponseEntity<?> updateUserByAdmin(Long id, Map<String, String> userData) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        
        // Check if email is being changed and if it's already taken
        String newEmail = userData.get("email");
        if (newEmail != null && !newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already taken"));
        }

        // Update user fields
        if (userData.get("firstName") != null) {
            user.setFirstName(userData.get("firstName"));
        }
        if (userData.get("lastName") != null) {
            user.setLastName(userData.get("lastName"));
        }
        if (newEmail != null) {
            user.setEmail(newEmail);
        }

        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "message", "User updated successfully",
            "firstName", user.getFirstName(),
            "lastName", user.getLastName(),
            "email", user.getEmail(),
            "role", user.getRole().toString()
        ));
    }
}