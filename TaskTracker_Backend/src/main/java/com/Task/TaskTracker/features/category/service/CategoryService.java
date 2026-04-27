package com.Task.TaskTracker.features.category.service;

import com.Task.TaskTracker.features.category.dto.CategoryRequest;
import com.Task.TaskTracker.shared.entity.Category;
import com.Task.TaskTracker.shared.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostConstruct
    public void initDefaultCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Work"));
            categoryRepository.save(new Category("Personal"));
            categoryRepository.save(new Category("Other"));
        }
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(CategoryRequest request) {
        Category category = new Category(request.getName());
        return categoryRepository.save(category);
    }

    public Category updateCategory(UUID id, CategoryRequest request) {
        Optional<Category> opt = categoryRepository.findById(id);
        if (opt.isPresent()) {
            Category category = opt.get();
            category.setName(request.getName());
            return categoryRepository.save(category);
        }
        throw new RuntimeException("Category not found");
    }

    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }
}
