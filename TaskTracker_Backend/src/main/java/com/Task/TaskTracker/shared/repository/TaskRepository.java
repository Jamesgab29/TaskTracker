package com.Task.TaskTracker.shared.repository;

import com.Task.TaskTracker.shared.entity.Task;
import com.Task.TaskTracker.shared.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUser(User user);
    // Can add search and pagination here later
}
