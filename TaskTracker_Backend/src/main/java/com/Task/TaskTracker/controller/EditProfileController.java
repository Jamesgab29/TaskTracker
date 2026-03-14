package com.Task.TaskTracker.controller;

import com.Task.TaskTracker.model.EditProfileRequest;
import com.Task.TaskTracker.service.EditProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

// 4. Edit Profile API Controller
@RestController
@RequestMapping("/api")
public class EditProfileController {

    @Autowired
    private EditProfileService editProfileService;

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> editProfile(@PathVariable UUID id, @RequestBody EditProfileRequest request) {
        boolean success = editProfileService.updateProfile(id, request);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
