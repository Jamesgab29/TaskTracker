// Auth feature - public API (barrel export)
export { AuthProvider, AuthContext } from './context/AuthContext';
export { useAuth } from './hooks/useAuth';
export { authService } from './services/authService';
export { ProtectedRoute } from './components/ProtectedRoute';
export { default as Login } from './pages/Login';
export { default as Register } from './pages/Register';
export type { AuthContextType } from './types';
