package com.Task.TaskTracker.service;

import com.Task.TaskTracker.entity.UserProfile;
import com.Task.TaskTracker.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserProfileRepository repository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserProfile register(String email, String password) {
        if (repository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        UserProfile user = new UserProfile();
        user.setEmail(email);
        user.setPassword(encoder.encode(password)); // Password Encryption
        return repository.save(user);
    }

    public String login(String email, String password) {
        var userOpt = repository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "Login Failed: Not yet registered";
        }
        var user = userOpt.get();
        if (!encoder.matches(password, user.getPassword())) {
            return "Login Failed: Wrong password";
        }
        return "Login Successful. ID: " + user.getId();
    }

    public boolean updatePassword(UUID id, String newPassword) {
        return repository.findById(id).map(user -> {
            user.setPassword(encoder.encode(newPassword));
            repository.save(user);
            return true;
        }).orElse(false);
    }
}