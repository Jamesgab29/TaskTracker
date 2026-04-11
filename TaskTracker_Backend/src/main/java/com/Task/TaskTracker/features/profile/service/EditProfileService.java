package com.Task.TaskTracker.features.profile.service;

import com.Task.TaskTracker.features.profile.dto.EditProfileRequest;
import com.Task.TaskTracker.shared.repository.ProfileInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

// 4. Edit Profile Service
@Service
public class EditProfileService {

    @Autowired
    private ProfileInformationRepository profileRepository;

    public boolean updateProfile(UUID userId, EditProfileRequest request) {
        return profileRepository.findByUserId(userId).map(profile -> {
            if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
            if (request.getLastName() != null) profile.setLastName(request.getLastName());
            if (request.getContactNumber() != null) profile.setContactNumber(request.getContactNumber());
            profileRepository.save(profile);
            return true;
        }).orElse(false);
    }
}
