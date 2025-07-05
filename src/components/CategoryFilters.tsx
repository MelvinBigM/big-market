
import { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, ChevronDown, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategoryFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

// Fonction pour extraire le volume d'un titre de produit
const extractVolume = (title: string): string | null => {
  const volumeRegex = /(\d+(?:,\d+)?)\s*(cl|ml|l|litre|litres?)\b/gi;
  const match = title.match(volumeRegex);
  
  if (!match) return null;
  
  const volumeStr = match[0].toLowerCase();
  
  // Normaliser les volumes vers des catégories standard
  if (volumeStr.includes('25cl') || volumeStr.includes('25 cl')) return '33cl';
  if (volumeStr.includes('33cl') || volumeStr.includes('33 cl')) return '33cl';
  if (volumeStr.includes('40cl') || volumeStr.includes('40 cl')) return '40cl';
  if (volumeStr.includes('50cl') || volumeStr.includes('50 cl')) return '50cl';
  if (volumeStr.includes('75cl') || volumeStr.includes('75 cl')) return '75cl';
  if (volumeStr.includes('1l') || volumeStr.includes('1 l') || volumeStr.includes('1litre')) return '1L';
  if (volumeStr.includes('1,25l') || volumeStr.includes('1,25 l') || volumeStr.includes('1.25l')) return '1,25L';
  if (volumeStr.includes('1,5l') || volumeStr.includes('1,5 l') || volumeStr.includes('1.5l')) return '1,5L';
  if (volumeStr.includes('2l') || volumeStr.includes('2 l') || volumeStr.includes('2litre')) return '2L';
  
  return match[0];
};

const CategoryFilters = ({ products, onFilterChange }: CategoryFiltersProps) => {
  const [showInStock, setShowInStock] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Extraire tous les volumes uniques des produits
  const availableVolumes = Array.from(
    new Set(
      products
        .map(product => extractVolume(product.name))
        .filter(volume => volume !== null)
    )
  ).sort();

  const applyFilters = (
    stockInFilter: boolean,
    stockOutFilter: boolean,
    volumeFilters: string[]
  ) => {
    let filtered = products;

    // Filtrer par stock
    filtered = filtered.filter(product => {
      if (product.in_stock && stockInFilter) return true;
      if (!product.in_stock && stockOutFilter) return true;
      return false;
    });

    // Filtrer par volume si des volumes sont sélectionnés
    if (volumeFilters.length > 0) {
      filtered = filtered.filter(product => {
        const productVolume = extractVolume(product.name);
        return productVolume && volumeFilters.includes(productVolume);
      });
    }

    onFilterChange(filtered);
  };

  const handleStockFilterChange = (type: 'in' | 'out', checked: boolean) => {
    const newShowInStock = type === 'in' ? checked : showInStock;
    const newShowOutOfStock = type === 'out' ? checked : showOutOfStock;
    
    setShowInStock(newShowInStock);
    setShowOutOfStock(newShowOutOfStock);
    
    applyFilters(newShowInStock, newShowOutOfStock, selectedVolumes);
  };

  const handleVolumeFilterChange = (volumes: string[]) => {
    setSelectedVolumes(volumes);
    applyFilters(showInStock, showOutOfStock, volumes);
  };

  const clearAllFilters = () => {
    setShowInStock(true);
    setShowOutOfStock(true);
    setSelectedVolumes([]);
    onFilterChange(products);
  };

  const hasActiveFilters = !showInStock || !showOutOfStock || selectedVolumes.length > 0;

  return (
    <div className="mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filtres
        {hasActiveFilters && (
          <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
            {(selectedVolumes.length > 0 ? selectedVolumes.length : 0) + (!showInStock || !showOutOfStock ? 1 : 0)}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border space-y-4">
          {/* Filtres de stock */}
          <div>
            <h4 className="font-medium mb-2 text-sm">Disponibilité</h4>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={showInStock}
                  onCheckedChange={(checked) => 
                    handleStockFilterChange('in', checked as boolean)
                  }
                />
                <Label htmlFor="in-stock" className="text-sm">
                  En stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="out-of-stock"
                  checked={showOutOfStock}
                  onCheckedChange={(checked) => 
                    handleStockFilterChange('out', checked as boolean)
                  }
                />
                <Label htmlFor="out-of-stock" className="text-sm">
                  En rupture
                </Label>
              </div>
            </div>
          </div>

          {/* Filtres de volume */}
          {availableVolumes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-sm">Volumes</h4>
              <ToggleGroup
                type="multiple"
                value={selectedVolumes}
                onValueChange={handleVolumeFilterChange}
                className="justify-start flex-wrap"
              >
                {availableVolumes.map((volume) => (
                  <ToggleGroupItem
                    key={volume}
                    value={volume}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {volume}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          {/* Bouton pour effacer tous les filtres */}
          {hasActiveFilters && (
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-8"
              >
                <X className="h-3 w-3 mr-1" />
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;
