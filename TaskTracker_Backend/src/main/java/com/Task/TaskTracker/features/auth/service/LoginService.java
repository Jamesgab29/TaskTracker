package com.Task.TaskTracker.features.auth.service;

import com.Task.TaskTracker.features.auth.dto.LoginRequest;
import com.Task.TaskTracker.features.auth.dto.LoginResponse;
import com.Task.TaskTracker.shared.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// 1. Login Service
@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

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
        return new LoginResponse("dummy-jwt-token", "Login Successful. ID: " + user.getId());
    }
}
