
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
import AdminAccessRequestsPage from "@/components/admin/AdminAccessRequestsPage";
import UserDetailsPage from "@/components/admin/UserDetailsPage";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { AuthProvider } from "@/components/AuthProvider";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
            path="/admin/users/:userId"
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
                <AdminAccessRequestsPage />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
