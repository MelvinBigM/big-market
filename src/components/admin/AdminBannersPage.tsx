import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button } from "@/components/ui/button";
import BannerList from "./banners/BannerList";
import BannerForm from "./banners/BannerForm";
import { useBanners } from "./banners/useBanners";

const AdminBannersPage = () => {
  const { profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    banners,
    isLoading,
    selectedBanner,
    setSelectedBanner,
    isDialogOpen,
    setIsDialogOpen,
    saveBanner,
    deleteBanner,
    openDialog
  } = useBanners();

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
      toast.error("Accès non autorisé");
    }
  }, [profile, authLoading, navigate]);

  if (authLoading || isLoading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des bannières
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => openDialog()} className="ml-auto">
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une bannière
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-4">Bannières actives</h2>
          
          <p className="text-gray-600 mb-6">
            Gérez les bannières qui apparaissent sur la page d'accueil. Les bannières sont affichées dans l'ordre de leur position.
            Dimensions recommandées: 1920x500 pixels.
          </p>

          <BannerList 
            banners={banners} 
            onEdit={openDialog} 
            onDelete={deleteBanner} 
          />
        </div>
      </div>

      <BannerForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedBanner={selectedBanner}
        setSelectedBanner={setSelectedBanner}
        onSave={saveBanner}
      />

      <Footer />
    </div>
  );
};

export default AdminBannersPage;
