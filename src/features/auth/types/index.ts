// Auth feature types

export interface AuthContextType {
    token: string | null;
    userId: string | null;
    isAuthenticated: boolean;
    login: (token: string, userId: string) => void;
    logout: () => void;
}
