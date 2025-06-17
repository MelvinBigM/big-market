
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CategoryHeaderProps {
  categoryName?: string;
  categoryDescription?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const CategoryHeader = ({ 
  categoryName, 
  categoryDescription, 
  searchQuery, 
  onSearchChange 
}: CategoryHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {categoryName}
      </h1>
      {categoryDescription && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {categoryDescription}
        </p>
      )}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryHeader;
