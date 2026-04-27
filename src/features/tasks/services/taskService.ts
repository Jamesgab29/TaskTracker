import api from '../../../shared/services/api';
import type { Task } from '../types';

export const taskService = {
    getTasks: async (userId: string) => {
        const response = await api.get(`/tasks?userId=${userId}&t=${Date.now()}`);
        return response.data;
    },

    getTask: async (id: string) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (task: Task) => {
        const response = await api.post('/tasks', task);
        return response.data;
    },

    updateTask: async (id: string, task: Task) => {
        const response = await api.put(`/tasks/${id}`, task);
        return response.data;
    },

    deleteTask: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    createCategory: async (name: string) => {
        const response = await api.post('/categories', { name });
        return response.data;
    }
};
