
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdvancedProductSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories?: { id: string; name: string }[];
  onFiltersChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  categoryId?: string;
  inStock?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

const AdvancedProductSearch = ({ 
  searchQuery, 
  onSearchChange, 
  categories = [], 
  onFiltersChange 
}: AdvancedProductSearchProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== null && value !== '';
  }).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Rechercher un produit par nom, description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-12"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Filtres actifs:</span>
          {filters.categoryId && (
            <Badge variant="outline" className="gap-1">
              Catégorie: {categories.find(c => c.id === filters.categoryId)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('categoryId')}
              />
            </Badge>
          )}
          {filters.inStock !== undefined && (
            <Badge variant="outline" className="gap-1">
              {filters.inStock ? 'En stock' : 'En rupture'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('inStock')}
              />
            </Badge>
          )}
          {filters.priceRange && (
            <Badge variant="outline" className="gap-1">
              Prix: {filters.priceRange.min || 0}€ - {filters.priceRange.max || '∞'}€
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('priceRange')}
              />
            </Badge>
          )}
          {filters.sortBy && (
            <Badge variant="outline" className="gap-1">
              Tri: {filters.sortBy} ({filters.sortOrder === 'desc' ? 'desc' : 'asc'})
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  clearFilter('sortBy');
                  clearFilter('sortOrder');
                }}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Effacer tout
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select 
                value={filters.categoryId || ""} 
                onValueChange={(value) => updateFilter('categoryId', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stock Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Disponibilité</label>
              <Select 
                value={filters.inStock?.toString() || ""} 
                onValueChange={(value) => updateFilter('inStock', value === "" ? undefined : value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les produits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les produits</SelectItem>
                  <SelectItem value="true">En stock uniquement</SelectItem>
                  <SelectItem value="false">En rupture uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix minimum (€)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.priceRange?.min || ""}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  min: e.target.value ? parseFloat(e.target.value) : undefined
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Prix maximum (€)</label>
              <Input
                type="number"
                placeholder="∞"
                value={filters.priceRange?.max || ""}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  max: e.target.value ? parseFloat(e.target.value) : undefined
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trier par</label>
              <Select 
                value={filters.sortBy || ""} 
                onValueChange={(value) => updateFilter('sortBy', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ordre par défaut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ordre par défaut</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="created_at">Date de création</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordre</label>
              <Select 
                value={filters.sortOrder || "asc"} 
                onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}
                disabled={!filters.sortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Croissant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Croissant</SelectItem>
                  <SelectItem value="desc">Décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AdvancedProductSearch;
