package com.Task.TaskTracker.features.tasks.service;

import com.Task.TaskTracker.features.tasks.dto.SubtaskRequest;
import com.Task.TaskTracker.features.tasks.dto.TaskRequest;
import com.Task.TaskTracker.shared.entity.Category;
import com.Task.TaskTracker.shared.entity.Subtask;
import com.Task.TaskTracker.shared.entity.Task;
import com.Task.TaskTracker.shared.entity.User;
import com.Task.TaskTracker.shared.repository.CategoryRepository;
import com.Task.TaskTracker.shared.repository.SubtaskRepository;
import com.Task.TaskTracker.shared.repository.TaskRepository;
import com.Task.TaskTracker.shared.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubtaskRepository subtaskRepository;

    public List<Task> getAllTasks(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByUser(user);
    }

    public Task getTaskById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task createTask(TaskRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : "Moderate");
        task.setStatus(request.getStatus() != null ? request.getStatus() : "Not Started");
        task.setDueDate(request.getDueDate());
        task.setUser(user);
        task.setCategory(category);
        
        List<Subtask> subtasks = new ArrayList<>();
        if (request.getSubtasks() != null) {
            for (SubtaskRequest sr : request.getSubtasks()) {
                Subtask subtask = new Subtask();
                subtask.setName(sr.getName());
                subtask.setCompleted(sr.isCompleted());
                subtask.setTask(task);
                subtasks.add(subtask);
            }
        }
        task.setSubtasks(subtasks);

        return taskRepository.save(task);
    }

    public Task updateTask(UUID id, TaskRequest request) {
        Task task = getTaskById(id);
        
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            task.setCategory(category);
        }

        if (request.getSubtasks() != null) {
            // Clear existing subtasks that are not in the new list, or add new ones
            if (task.getSubtasks() == null) {
                task.setSubtasks(new ArrayList<>());
            }
            task.getSubtasks().clear();
            for (SubtaskRequest sr : request.getSubtasks()) {
                Subtask subtask = new Subtask();
                subtask.setName(sr.getName());
                subtask.setCompleted(sr.isCompleted());
                subtask.setTask(task);
                task.getSubtasks().add(subtask);
            }
        }

        return taskRepository.save(task);
    }

    public void deleteTask(UUID id) {
        taskRepository.deleteById(id);
    }
}
