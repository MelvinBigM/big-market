
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminUsersPage from './components/admin/AdminUsersPage';
import UserDetailsPage from "./components/admin/UserDetailsPage";
import { AuthProvider } from './lib/auth';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute>} />
          <Route path="/admin/users/:userId" element={<AdminProtectedRoute><UserDetailsPage /></AdminProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
