package com.Task.TaskTracker.features.profile.dto;

// 4. Edit Profile Request DTO
public class EditProfileRequest {
    private String firstName;
    private String lastName;
    private String contactNumber;

    public EditProfileRequest() {}

    public EditProfileRequest(String firstName, String lastName, String contactNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactNumber = contactNumber;
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
