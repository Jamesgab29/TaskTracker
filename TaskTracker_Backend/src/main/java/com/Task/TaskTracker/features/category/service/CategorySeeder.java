package com.Task.TaskTracker.features.category.service;

import com.Task.TaskTracker.shared.entity.Category;
import com.Task.TaskTracker.shared.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategorySeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            System.out.println("Seeding default categories...");
            categoryRepository.saveAll(List.of(
                    new Category("Work"),
                    new Category("Personal"),
                    new Category("School")
            ));
            System.out.println("Default categories seeded successfully.");
        }
    }
}
