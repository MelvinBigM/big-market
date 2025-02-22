import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { AuthProvider } from './lib/auth';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminUsersPage from './components/admin/AdminUsersPage';
import { Toaster } from 'sonner';
import CategoriesPage from './components/CategoriesPage';
import ProductsPage from './components/ProductsPage';
import EditCategoryPage from './components/admin/EditCategoryPage';
import CreateCategoryPage from './components/admin/CreateCategoryPage';
import EditProductPage from './components/admin/EditProductPage';
import CreateProductPage from './components/admin/CreateProductPage';
// Importez la nouvelle page
import UserDetailsPage from "@/components/admin/UserDetailsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId/products" element={<ProductsPage />} />
            <Route path="/admin/categories/:categoryId/edit" element={<AdminProtectedRoute><EditCategoryPage /></AdminProtectedRoute>} />
            <Route path="/admin/categories/create" element={<AdminProtectedRoute><CreateCategoryPage /></AdminProtectedRoute>} />
            <Route path="/admin/products/:productId/edit" element={<AdminProtectedRoute><EditProductPage /></AdminProtectedRoute>} />
            <Route path="/admin/categories/:categoryId/products/create" element={<AdminProtectedRoute><CreateProductPage /></AdminProtectedRoute>} />
            <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute>} />
            <Route path="/admin/users/:userId" element={<UserDetailsPage />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
