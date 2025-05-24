
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import CategoryDialog from "./CategoryDialog";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const CategoriesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: categories, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position");

      if (error) {
        throw error;
      }

      return data as Category[];
    },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !categories) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mise à jour des positions dans la base de données
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image_url: item.image_url,
        position: index,
      }));

      const { error } = await supabase
        .from("categories")
        .upsert(updates);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      toast.error("Erreur lors de la réorganisation des catégories");
    }
  };

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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid gap-4"
            >
              {categories?.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200
                        ${snapshot.isDragging 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-move text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                          {category.image_url && (
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200 mr-4"
                            />
                          )}
                          <div className="text-center">
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            {category.description && (
                              <p className="text-sm text-gray-600">{category.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          className="hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
