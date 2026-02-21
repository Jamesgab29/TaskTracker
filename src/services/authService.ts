import api from './api';

export const authService = {
    login: async (credentials: any) => {
        // try {
        //   const response = await api.post('/auth/login', credentials);
        //   return response.data;
        // } catch (error) {
        //   throw error;
        // }
        // Mock for now until backend is connected
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ token: 'mock-jwt-token-123', user: { email: credentials.email } });
            }, 1000);
        });
    },

    register: async (userData: any) => {
        // try {
        //   const response = await api.post('/auth/register', userData);
        //   return response.data;
        // } catch (error) {
        //   throw error;
        // }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: 'User registered successfully' });
            }, 1000);
        });
    },
};
