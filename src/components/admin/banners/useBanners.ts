
import { useBannersFetch } from "./hooks/useBannersFetch";
import { useBannerEdit } from "./hooks/useBannerEdit";
import { useBannerDelete } from "./hooks/useBannerDelete";

export const useBanners = () => {
  // Use the smaller hooks
  const { banners, isLoading, fetchBanners } = useBannersFetch();
  const { 
    selectedBanner, 
    setSelectedBanner, 
    isDialogOpen, 
    setIsDialogOpen, 
    saveBanner, 
    openDialog 
  } = useBannerEdit(fetchBanners);
  const { deleteBanner } = useBannerDelete(fetchBanners);

  // Return everything needed by consumers
  return {
    banners,
    isLoading,
    selectedBanner,
    setSelectedBanner,
    isDialogOpen,
    setIsDialogOpen,
    fetchBanners,
    saveBanner,
    deleteBanner,
    openDialog
  };
};
