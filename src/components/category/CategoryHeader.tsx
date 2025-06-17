
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoryHeaderProps {
  categoryName?: string;
  categoryDescription?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CategoryHeader = ({
  categoryName,
  categoryDescription,
  searchQuery,
  onSearchChange,
}: CategoryHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryName || "Catégorie"}
        </h1>
        {categoryDescription && (
          <p className="text-gray-600 max-w-2xl mx-auto">
            {categoryDescription}
          </p>
        )}
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
