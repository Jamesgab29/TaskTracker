import api from '../../../shared/services/api';

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/login', credentials);
        return response.data;
    },

    register: async (userData: any) => {
        const response = await api.post('/register', userData);
        return response.data;
    },
};
