package com.Task.TaskTracker.controller;

import com.Task.TaskTracker.model.LoginRequest;
import com.Task.TaskTracker.model.LoginResponse;
import com.Task.TaskTracker.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// 1. Login API Controller
@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse response = loginService.login(request);
        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        }
        if (response.getMessage().contains("Not yet registered")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", response.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", response.getMessage()));
    }
}
