package com.Task.TaskTracker.features.auth.service;

import com.Task.TaskTracker.shared.entity.ProfileInformation;
import com.Task.TaskTracker.shared.entity.User;
import com.Task.TaskTracker.features.auth.dto.RegisterRequest;
import com.Task.TaskTracker.features.auth.dto.RegisterResponse;
import com.Task.TaskTracker.shared.repository.ProfileInformationRepository;
import com.Task.TaskTracker.shared.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// 2. Register Service
@Service
public class RegisterService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileInformationRepository profileRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create user in "users" table
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        User savedUser = userRepository.save(user);

        // Create empty profile in "profile_information" table
        ProfileInformation profile = new ProfileInformation();
        profile.setUser(savedUser);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profileRepository.save(profile);

        return new RegisterResponse(
            "User registered successfully",
            savedUser.getId().toString(),
            savedUser.getEmail()
        );
    }
}
