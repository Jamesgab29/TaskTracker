package com.Task.TaskTracker.model;

// 5. Edit Password Request Model
public class EditPasswordRequest {
    private String newPassword;

    public EditPasswordRequest() {}

    public EditPasswordRequest(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
