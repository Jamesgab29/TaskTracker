package com.Task.TaskTracker.features.tasks.dto;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public class TaskRequest {
    private String title;
    private String description;
    private String priority;
    private String status;
    private Date dueDate;
    private UUID categoryId;
    private UUID userId;
    private List<SubtaskRequest> subtasks;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public UUID getCategoryId() { return categoryId; }
    public void setCategoryId(UUID categoryId) { this.categoryId = categoryId; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public List<SubtaskRequest> getSubtasks() { return subtasks; }
    public void setSubtasks(List<SubtaskRequest> subtasks) { this.subtasks = subtasks; }
}
