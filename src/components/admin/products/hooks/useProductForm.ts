
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export const useProductForm = (
  product: Product | undefined,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void
) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [vatRate, setVatRate] = useState<string>("5.5");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setImageUrl(product.image_url || "");
      setPrice(product.price.toString());
      setCategoryId(product.category_id);
      setVatRate(product.vat_rate?.toString() || "5.5");
    } else {
      setName("");
      setDescription("");
      setImageUrl("");
      setPrice("");
      setCategoryId("");
      setVatRate("5.5");
    }
  }, [product]);

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
            vat_rate: parseFloat(vatRate),
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
              vat_rate: parseFloat(vatRate),
            },
          ]);

        if (error) throw error;
        toast.success("Produit créé avec succès");
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
