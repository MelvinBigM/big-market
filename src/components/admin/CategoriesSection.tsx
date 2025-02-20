
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import CategoryDialog from "./CategoryDialog";
import { toast } from "sonner";

const CategoriesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      return data as Category[];
    },
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      try {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", category.id);

        if (error) throw error;
        
        toast.success("Catégorie supprimée avec succès");
        refetch();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Catégories</h2>
        <Button onClick={() => {
          setSelectedCategory(undefined);
          setDialogOpen(true);
        }}>
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-medium">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600">{category.description}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(category)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSuccess={refetch}
      />
    </div>
  );
};

export default CategoriesSection;
