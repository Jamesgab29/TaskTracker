package com.Task.TaskTracker.service;

import com.Task.TaskTracker.model.EditPasswordRequest;
import com.Task.TaskTracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

// 5. Edit Password Service
@Service
public class EditPasswordService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public boolean updatePassword(UUID userId, EditPasswordRequest request) {
        return userRepository.findById(userId).map(user -> {
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return true;
        }).orElse(false);
    }
}
