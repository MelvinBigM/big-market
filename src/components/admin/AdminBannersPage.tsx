
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
    openDialog,
    toggleBannerActive,
    reorderBanners
  } = useBanners();

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
      toast.error("Accès non autorisé");
    }
  }, [profile, authLoading, navigate]);

  const handleReorder = (result: any) => {
    reorderBanners(result, banners);
  };

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
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des bannières
          </h1>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-card-foreground">Bannières photo</h2>
          
          <p className="text-muted-foreground mb-6">
            Gérez les bannières photo qui apparaissent sur la page d'accueil. Faites glisser les bannières pour changer leur ordre d'affichage.
            Dimensions exactes requises: 1920x250 pixels. Seules les bannières photo avec ces dimensions exactes sont acceptées.
          </p>
          
          <div className="flex justify-center mb-6">
            <Button onClick={() => openDialog()}>
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une bannière photo
            </Button>
          </div>

          <BannerList 
            banners={banners} 
            onEdit={openDialog} 
            onDelete={deleteBanner}
            onToggleActive={toggleBannerActive}
            onReorder={handleReorder}
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
