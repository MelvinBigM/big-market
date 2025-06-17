
import { useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useState, useMemo } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RequestClientAccessDialog from "@/components/RequestClientAccessDialog";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";
import CategoryHeader from "@/components/category/CategoryHeader";
import ProductsGrid from "@/components/category/ProductsGrid";
import { useCategoryData } from "@/hooks/useCategoryData";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccessDialog, setShowAccessDialog] = useState(false);

  const { category, products, isLoading, error } = useCategoryData(categoryId);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';
  const isNewUser = profile?.role === 'nouveau';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 py-[62px]">
          <LoadingState message="Chargement de la catégorie..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 py-[62px]">
          <ErrorState 
            message="Erreur lors du chargement de la catégorie" 
            onRetry={() => window.location.reload()} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 py-[62px]">
        <div className="max-w-[1920px] mx-auto">
          <CategoryHeader
            categoryName={category?.name}
            categoryDescription={category?.description}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <ProductsGrid
            products={filteredProducts}
            canSeePrice={canSeePrice}
            isNewUser={isNewUser}
            searchQuery={searchQuery}
          />
        </div>
      </main>
      <Footer />
      <RequestClientAccessDialog 
        open={showAccessDialog} 
        onOpenChange={setShowAccessDialog} 
      />
    </div>
  );
};

export default CategoryPage;
