import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LegalPage from "@/pages/LegalPage";
import NotFound from "@/pages/NotFound";
import CategoryPage from "@/pages/CategoryPage";
import ProductPage from "@/pages/ProductPage";
import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsersPage from "@/components/admin/AdminUsersPage";
import AdminCategoriesPage from "@/components/admin/AdminCategoriesPage";
import AdminProductsPage from "@/components/admin/AdminProductsPage";
import UserDetailsPage from "@/components/admin/UserDetailsPage";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { AuthProvider } from "@/components/AuthProvider";
import "./App.css";
import { QueryProvider } from "@/components/QueryProvider";
import { Toaster } from "@/components/Toaster";
import AccessRequestsPage from "@/pages/AccessRequestsPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <AdminUsersPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <AdminProtectedRoute>
                  <UserDetailsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminProtectedRoute>
                  <AdminCategoriesPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminProtectedRoute>
                  <AdminProductsPage />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/access-requests"
              element={
                <AdminProtectedRoute>
                  <AccessRequestsPage />
                </AdminProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </QueryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
