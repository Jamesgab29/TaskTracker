import React, { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import type { Task, Category } from '../types';
import { taskService } from '../services/taskService';
import { useAuth } from '../../auth/hooks/useAuth';

interface TaskContextType {
    tasks: Task[];
    categories: Category[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    categoryFilter: string | 'All';
    setCategoryFilter: (c: string | 'All') => void;
    addTask: (task: Omit<Task, 'id' | 'createdOn'>) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    refreshTasks: () => Promise<void>;
    addCategory: (name: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userId } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | 'All'>('All');

    const fetchCategories = async () => {
        try {
            const data = await taskService.getCategories();
            if (data && data.categories) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchTasks = async () => {
        if (!userId) return;
        try {
            const data = await taskService.getTasks(userId);
            if (data && data.tasks) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    const addCategory = async (name: string) => {
        try {
            await taskService.createCategory(name);
            await fetchCategories();
        } catch (error) {
            console.error('Failed to add category:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchTasks();
        } else {
            setTasks([]);
        }
    }, [userId]);

    const addTask = async (newTaskData: Omit<Task, 'id' | 'createdOn'>) => {
        if (!userId) return;
        try {
            await taskService.createTask({ ...newTaskData, userId });
            await fetchTasks();
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const updateTask = async (updatedTask: Task) => {
        if (!updatedTask.id) return;
        try {
            await taskService.updateTask(updatedTask.id, updatedTask);
            await fetchTasks();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await taskService.deleteTask(id);
            await fetchTasks();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    return (
        <TaskContext.Provider value={{
            tasks, categories, addTask, updateTask, deleteTask,
            searchQuery, setSearchQuery,
            categoryFilter, setCategoryFilter,
            refreshTasks: fetchTasks,
            addCategory
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
