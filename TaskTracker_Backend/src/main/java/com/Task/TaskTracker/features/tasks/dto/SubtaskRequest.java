package com.Task.TaskTracker.features.tasks.dto;

import java.util.UUID;

public class SubtaskRequest {
    private UUID id;
    private String name;
    private boolean completed;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
