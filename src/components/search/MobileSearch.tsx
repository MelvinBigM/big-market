
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductSearch from "./ProductSearch";

interface MobileSearchProps {
  onClose: () => void;
}

const MobileSearch = ({ onClose }: MobileSearchProps) => {
  const [showSearch, setShowSearch] = useState(false);

  if (showSearch) {
    return (
      <div className="px-3 py-2">
        <ProductSearch onClose={() => {
          setShowSearch(false);
          onClose();
        }} />
      </div>
    );
  }

  return (
    <div className="px-3 pb-2">
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => setShowSearch(true)}
      >
        <Search className="h-5 w-5 mr-2" />
        Rechercher un produit
      </Button>
    </div>
  );
};

export default MobileSearch;
