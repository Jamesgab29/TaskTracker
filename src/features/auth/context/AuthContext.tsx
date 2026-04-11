import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    const login = (newToken: string, newUserId: string) => {
        setToken(newToken);
        setUserId(newUserId);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, userId, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
