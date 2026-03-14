package com.Task.TaskTracker.model;

// 2. Register Response Model
public class RegisterResponse {
    private String message;
    private String id;
    private String email;

    public RegisterResponse() {}

    public RegisterResponse(String message, String id, String email) {
        this.message = message;
        this.id = id;
        this.email = email;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
