
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CategoriesSection from "./CategoriesSection";

const AdminCategoriesPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-16 pb-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Gestion des catégories
            </h1>
          </div>
          <CategoriesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCategoriesPage;
