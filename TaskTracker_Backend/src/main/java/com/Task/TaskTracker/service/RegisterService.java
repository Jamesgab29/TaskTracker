package com.Task.TaskTracker.service;

import com.Task.TaskTracker.entity.ProfileInformation;
import com.Task.TaskTracker.entity.User;
import com.Task.TaskTracker.model.RegisterRequest;
import com.Task.TaskTracker.model.RegisterResponse;
import com.Task.TaskTracker.repository.ProfileInformationRepository;
import com.Task.TaskTracker.repository.UserRepository;
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
        profileRepository.save(profile);

        return new RegisterResponse(
            "User registered successfully",
            savedUser.getId().toString(),
            savedUser.getEmail()
        );
    }
}
