
import { useMemo } from "react";
import { Product } from "@/lib/types";
import { SearchFilters } from "@/components/search/AdvancedProductSearch";

interface UseProductSearchProps {
  products?: (Product & { categories: { id: string; name: string } })[];
  searchQuery: string;
  filters: SearchFilters;
}

export const useProductSearch = ({ products, searchQuery, filters }: UseProductSearchProps) => {
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.categories.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categoryId) {
      filtered = filtered.filter(product => product.category_id === filters.categoryId);
    }

    // Stock filter
    if (filters.inStock !== undefined) {
      filtered = filtered.filter(product => product.in_stock === filters.inStock);
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        filtered = filtered.filter(product => product.price >= filters.priceRange!.min!);
      }
      if (filters.priceRange.max !== undefined) {
        filtered = filtered.filter(product => product.price <= filters.priceRange!.max!);
      }
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'created_at':
            aValue = new Date(a.created_at);
            bValue = new Date(b.created_at);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchQuery, filters]);

  return { filteredProducts };
};
