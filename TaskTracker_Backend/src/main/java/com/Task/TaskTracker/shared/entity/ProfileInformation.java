package com.Task.TaskTracker.shared.entity;

import jakarta.persistence.*;
import java.util.UUID;

// Profile Information Entity - for user profile details
// Stored in "profile_information" table in Supabase
@Entity
@Table(name = "profile_information")
public class ProfileInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // Foreign key linking to the User entity
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    private String firstName;

    private String lastName;

    private String contactNumber;

    @Column(name = "profile_picture", columnDefinition = "bytea")
    private byte[] profilePicture;

    // --- GETTERS AND SETTERS ---

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public byte[] getProfilePicture() { return profilePicture; }
    public void setProfilePicture(byte[] profilePicture) { this.profilePicture = profilePicture; }
}
