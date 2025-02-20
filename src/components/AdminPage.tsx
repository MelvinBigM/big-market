
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CategoriesSection from "./admin/CategoriesSection";
import ProductsSection from "./admin/ProductsSection";

const AdminPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
                alt="Big Market Logo" 
                className="h-12 w-12"
              />
              <h1 className="text-3xl font-bold text-gray-900">
                Administration
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <CategoriesSection />
            <ProductsSection />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
