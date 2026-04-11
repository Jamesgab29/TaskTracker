package com.Task.TaskTracker.features.profile.service;

import com.Task.TaskTracker.shared.entity.ProfileInformation;
import com.Task.TaskTracker.shared.entity.User;
import com.Task.TaskTracker.shared.repository.ProfileInformationRepository;
import com.Task.TaskTracker.shared.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

// 3. Profile Service
@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileInformationRepository profileRepository;

    public Optional<Map<String, Object>> getProfile(UUID userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Optional.empty();

        User user = userOpt.get();
        Optional<ProfileInformation> profileOpt = profileRepository.findByUserId(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("email", user.getEmail());

        if (profileOpt.isPresent()) {
            ProfileInformation profile = profileOpt.get();
            result.put("firstName", profile.getFirstName());
            result.put("lastName", profile.getLastName());
            result.put("contactNumber", profile.getContactNumber());
            result.put("hasProfilePicture", profile.getProfilePicture() != null);
        }

        return Optional.of(result);
    }
}
