package com.Task.TaskTracker.shared.repository;

import com.Task.TaskTracker.shared.entity.ProfileInformation;
import com.Task.TaskTracker.shared.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

// Profile Information Repository - for profile data queries
@Repository
public interface ProfileInformationRepository extends JpaRepository<ProfileInformation, UUID> {
    Optional<ProfileInformation> findByUser(User user);
    Optional<ProfileInformation> findByUserId(UUID userId);
}
