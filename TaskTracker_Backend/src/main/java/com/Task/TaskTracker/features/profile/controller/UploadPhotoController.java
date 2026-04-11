package com.Task.TaskTracker.features.profile.controller;

import com.Task.TaskTracker.features.profile.service.UploadPhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

// 6. Upload Photo API Controller
@RestController
@RequestMapping("/api")
public class UploadPhotoController {

    @Autowired
    private UploadPhotoService uploadPhotoService;

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadPhoto(@RequestParam("id") UUID id, @RequestParam("file") MultipartFile file) {
        try {
            boolean success = uploadPhotoService.uploadPhoto(id, file);
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "message", "Successfully uploaded " + file.getOriginalFilename(),
                    "fileName", file.getOriginalFilename(),
                    "fileSize", file.getSize()
                ));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/{id}/photo")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable UUID id) {
        return uploadPhotoService.getPhoto(id)
                .map(photo -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(photo))
                .orElse(ResponseEntity.notFound().build());
    }
}
