import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Feature imports - Vertical Slicing Architecture
import { AuthProvider, ProtectedRoute, Login, Register } from './features/auth';
import { TaskProvider, Dashboard } from './features/tasks';
import { Settings } from './features/settings';

// Shared imports
import { Layout } from './shared';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
