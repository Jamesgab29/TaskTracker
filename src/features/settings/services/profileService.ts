import api from '../../../shared/services/api';
import type { UserProfile } from '../types';

export const profileService = {
    getProfile: async (id: string): Promise<UserProfile> => {
        const response = await api.get(`/profile/${id}`);
        return response.data;
    },

    updateProfile: async (id: string, data: Partial<UserProfile>): Promise<string> => {
        const response = await api.put(`/profile/${id}`, data);
        return response.data;
    },

    updatePassword: async (id: string, newPassword: string): Promise<string> => {
        const response = await api.put(`/edit-password/${id}`, { newPassword });
        return response.data;
    },

    uploadPhoto: async (id: string, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('file', file);
        const response = await api.post('/upload-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
