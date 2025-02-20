
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import ProductDialog from "./ProductDialog";
import { toast } from "sonner";

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: productsWithCategories, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `)
        .order("name");

      if (productsError) throw productsError;

      return products as (Product & { categories: { name: string } })[];
    },
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (error) throw error;
        
        toast.success("Produit supprimé avec succès");
        refetch();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h2 className="text-xl font-semibold text-gray-900">Produits</h2>
        </div>
        <Button onClick={() => {
          setSelectedProduct(undefined);
          setDialogOpen(true);
        }}>
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <div className="grid gap-4">
        {productsWithCategories?.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{product.price} €</span>
                  {" • "}
                  <span>{product.categories.name}</span>
                </div>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(product)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(product)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ProductsSection;
