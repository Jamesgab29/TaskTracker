package com.Task.TaskTracker.features.profile.controller;

import com.Task.TaskTracker.features.profile.dto.EditPasswordRequest;
import com.Task.TaskTracker.features.profile.service.EditPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

// 5. Edit Password API Controller
@RestController
@RequestMapping("/api")
public class EditPasswordController {

    @Autowired
    private EditPasswordService editPasswordService;

    @PutMapping("/edit-password/{id}")
    public ResponseEntity<?> editPassword(@PathVariable UUID id, @RequestBody EditPasswordRequest request) {
        boolean success = editPasswordService.updatePassword(id, request);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
    }
}
