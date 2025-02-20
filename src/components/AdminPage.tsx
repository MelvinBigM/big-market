
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte Catégories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Catégories</h2>
            <p className="text-gray-600 mb-4">
              Gérez les catégories de produits disponibles dans votre boutique.
            </p>
            <Button className="w-full">
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une catégorie
            </Button>
          </div>

          {/* Carte Produits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Produits</h2>
            <p className="text-gray-600 mb-4">
              Gérez l'inventaire de vos produits et leurs informations.
            </p>
            <Button className="w-full">
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un produit
            </Button>
          </div>

          {/* Carte Utilisateurs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilisateurs</h2>
            <p className="text-gray-600 mb-4">
              Consultez et gérez les comptes utilisateurs de la plateforme.
            </p>
            <Button className="w-full">
              Voir les utilisateurs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
