package com.Task.TaskTracker.features.profile.service;

import com.Task.TaskTracker.shared.repository.ProfileInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

// 6. Upload Photo Service
@Service
public class UploadPhotoService {

    @Autowired
    private ProfileInformationRepository profileRepository;

    public boolean uploadPhoto(UUID userId, MultipartFile file) throws IOException {
        return profileRepository.findByUserId(userId).map(profile -> {
            try {
                profile.setProfilePicture(file.getBytes());
                profileRepository.save(profile);
                return true;
            } catch (IOException e) {
                throw new RuntimeException("Failed to read file", e);
            }
        }).orElse(false);
    }

    public Optional<byte[]> getPhoto(UUID userId) {
        return profileRepository.findByUserId(userId)
                .filter(p -> p.getProfilePicture() != null)
                .map(p -> p.getProfilePicture());
    }
}
