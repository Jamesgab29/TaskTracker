package com.Task.TaskTracker.repository;

import com.Task.TaskTracker.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    // This method fixes the findByEmail error in your AuthService
    Optional<UserProfile> findByEmail(String email);
}