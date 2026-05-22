package com.Task.TaskTracker.features.auth.service;

import com.Task.TaskTracker.features.auth.dto.LoginRequest;
import com.Task.TaskTracker.features.auth.dto.LoginResponse;
import com.Task.TaskTracker.shared.entity.ProfileInformation;
import com.Task.TaskTracker.shared.repository.ProfileInformationRepository;
import com.Task.TaskTracker.shared.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// 1. Login Service
@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileInformationRepository profileRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public LoginResponse login(LoginRequest request) {
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return new LoginResponse(null, "Login Failed: Not yet registered");
        }
        var user = userOpt.get();
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(null, "Login Failed: Wrong password");
        }

        Optional<ProfileInformation> profileOpt = profileRepository.findByUserId(user.getId());
        String firstName = null;
        String lastName = null;
        if (profileOpt.isPresent()) {
            firstName = profileOpt.get().getFirstName();
            lastName = profileOpt.get().getLastName();
        }

        return new LoginResponse(
            "dummy-jwt-token", 
            "Login Successful. ID: " + user.getId(),
            user.getEmail(),
            firstName,
            lastName
        );
    }
}
