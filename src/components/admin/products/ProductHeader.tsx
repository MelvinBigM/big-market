
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductHeaderProps {
  onAddProduct: () => void;
}

const ProductHeader = ({ onAddProduct }: ProductHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Produits</h2>
      <Button onClick={onAddProduct}>
        <Plus className="h-5 w-5 mr-2" />
        Ajouter un produit
      </Button>
    </div>
  );
};

export default ProductHeader;
