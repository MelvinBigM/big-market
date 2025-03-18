
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, Category } from "@/lib/types";
import { useProductForm } from "./products/hooks/useProductForm";
import ProductFormFields from "./products/ProductFormFields";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSuccess: () => void;
}

const ProductDialog = ({ open, onOpenChange, product, onSuccess }: ProductDialogProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });

  const {
    isLoading,
    name,
    setName,
    description,
    setDescription,
    imageUrl,
    setImageUrl,
    price,
    setPrice,
    categoryId,
    setCategoryId,
    vatRate,
    setVatRate,
    handleSubmit,
  } = useProductForm(product, onSuccess, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {product ? "Modifier le produit" : "Ajouter un produit"}
            </DialogTitle>
          </DialogHeader>
          
          <ProductFormFields
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            vatRate={vatRate}
            setVatRate={setVatRate}
            categories={categories}
          />
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : product ? (
                "Mettre à jour"
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
