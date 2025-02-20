
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product, Category } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSuccess: () => void;
}

const ProductDialog = ({ open, onOpenChange, product, onSuccess }: ProductDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [inStock, setInStock] = useState(true);

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

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setImageUrl(product.image_url || "");
      setPrice(product.price.toString());
      setCategoryId(product.category_id);
      setInStock(product.in_stock);
    } else {
      setName("");
      setDescription("");
      setImageUrl("");
      setPrice("");
      setCategoryId("");
      setInStock(true);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (product) {
        const { error } = await supabase
          .from("products")
          .update({
            name,
            description,
            image_url: imageUrl,
            price: parseFloat(price),
            category_id: categoryId,
            in_stock: inStock,
          })
          .eq("id", product.id);

        if (error) throw error;
        toast.success("Produit mis à jour avec succès");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([
            {
              name,
              description,
              image_url: imageUrl,
              price: parseFloat(price),
              category_id: categoryId,
              in_stock: inStock,
            },
          ]);

        if (error) throw error;
        toast.success("Produit créé avec succès");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {product ? "Modifier le produit" : "Ajouter un produit"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du produit"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du produit"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Prix du produit"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de l'image"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={inStock}
                onCheckedChange={(checked) => setInStock(checked as boolean)}
              />
              <Label htmlFor="inStock">En stock</Label>
            </div>
          </div>
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
