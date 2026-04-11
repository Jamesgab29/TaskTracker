package com.Task.TaskTracker.features.profile.dto;

// 5. Edit Password Request DTO
public class EditPasswordRequest {
    private String newPassword;

    public EditPasswordRequest() {}

    public EditPasswordRequest(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
