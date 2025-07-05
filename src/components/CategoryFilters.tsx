
import { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const handleVolumeFilterChange = (volume: string, checked: boolean) => {
    const newSelectedVolumes = checked
      ? [...selectedVolumes, volume]
      : selectedVolumes.filter(v => v !== volume);
    
    setSelectedVolumes(newSelectedVolumes);
    applyFilters(showInStock, showOutOfStock, newSelectedVolumes);
  };

  const clearAllFilters = () => {
    setShowInStock(true);
    setShowOutOfStock(true);
    setSelectedVolumes([]);
    onFilterChange(products);
  };

  const hasActiveFilters = !showInStock || !showOutOfStock || selectedVolumes.length > 0;

  return (
    <Card className="w-full mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
                {hasActiveFilters && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Actifs
                  </span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Filtres de stock */}
            <div>
              <h4 className="font-medium mb-3">Disponibilité</h4>
              <div className="space-y-2">
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
                <h4 className="font-medium mb-3">Volumes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableVolumes.map((volume) => (
                    <div key={volume} className="flex items-center space-x-2">
                      <Checkbox
                        id={`volume-${volume}`}
                        checked={selectedVolumes.includes(volume)}
                        onCheckedChange={(checked) =>
                          handleVolumeFilterChange(volume, checked as boolean)
                        }
                      />
                      <Label htmlFor={`volume-${volume}`} className="text-sm">
                        {volume}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton pour effacer tous les filtres */}
            {hasActiveFilters && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Effacer tous les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CategoryFilters;
