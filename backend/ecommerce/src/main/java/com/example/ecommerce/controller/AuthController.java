package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CompleteResetRequest;
import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.RegisterRequest;
import com.example.ecommerce.dto.ResetPasswordRequest;
import com.example.ecommerce.dto.UpdateProfileRequest;
import com.example.ecommerce.model.User;
import com.example.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken() {
        return authService.verifyToken();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    @PostMapping("/complete-reset")
    public ResponseEntity<?> completeReset(@Valid @RequestBody CompleteResetRequest request) {
        return authService.completeReset(request);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return authService.updateProfile(request);
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("image") MultipartFile file) {
        return authService.uploadAvatar(file);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        return authService.changePassword(currentPassword, newPassword);
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @GetMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return authService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody String role) {
        boolean success = authService.updateUserRole(id, role.replaceAll("\"", ""));
        if (success) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().body("Invalid role or user not found");
    }

    @PostMapping("/admin/users/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long id) {
        boolean success = authService.resetUserPassword(id, "user1234");
        if (success) return ResponseEntity.ok().body("Password reset to 'user1234'");
        return ResponseEntity.badRequest().body("User not found");
    }

    @PutMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> userData) {
        return authService.updateUserByAdmin(id, userData);
    }
}