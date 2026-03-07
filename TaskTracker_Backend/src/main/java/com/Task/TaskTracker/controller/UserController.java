package com.Task.TaskTracker.controller;

import com.Task.TaskTracker.entity.UserProfile;
import com.Task.TaskTracker.repository.UserProfileRepository;
import com.Task.TaskTracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserProfileRepository profileRepo;

    // 1 & 2. Login and Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> creds) {
        try {
            UserProfile profile = authService.register(creds.get("email"), creds.get("password"));
            return ResponseEntity.status(HttpStatus.CREATED).body(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String result = authService.login(creds.get("email"), creds.get("password"));
        if (result.contains("Successful")) {
            return ResponseEntity.ok(Map.of("token", "dummy-jwt-token", "message", result));
        }
        if (result.contains("Not yet registered")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", result));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", result));
    }

    // 3. Profile API (Retrieve)
    @GetMapping("/profile/{id}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable UUID id) {
        return profileRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Edit Profile API
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> editProfile(@PathVariable UUID id, @RequestBody Map<String, String> updates) {
        return profileRepo.findById(id).map(profile -> {
            if (updates.containsKey("fullName")) profile.setFullName(updates.get("fullName"));
            profileRepo.save(profile);
            return ResponseEntity.ok("Profile updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Edit Password API
    @PutMapping("/edit-password/{id}")
    public ResponseEntity<?> editPassword(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        boolean success = authService.updatePassword(id, body.get("newPassword"));
        if (success) return ResponseEntity.ok("Password changed successfully");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    // 6. Upload Photo API (Saves as BLOB/BYTEA)
    @PostMapping("/upload-photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") UUID id, @RequestParam("file") MultipartFile file) {
        try {
            UserProfile profile = profileRepo.findById(id).orElse(new UserProfile());
            profile.setId(id);
            profile.setProfilePicture(file.getBytes());
            profileRepo.save(profile);
            return ResponseEntity.ok("Successfully uploaded " + file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}