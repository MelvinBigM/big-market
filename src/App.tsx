
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminCategoriesPage from "./components/admin/AdminCategoriesPage";
import AdminProductsPage from "./components/admin/AdminProductsPage";
import AdminUsersPage from "./components/admin/AdminUsersPage";
import AdminRegistrationsPage from "./components/admin/AdminRegistrationsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LegalPage from "./pages/LegalPage";
import AuthProvider from "./components/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
