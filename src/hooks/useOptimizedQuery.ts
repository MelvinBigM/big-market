
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

// Configuration optimisée pour React Query
export const defaultQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

// Hook personnalisé avec optimisations
export const useOptimizedQuery = <T>(
  options: UseQueryOptions<T> & { queryKey: unknown[]; queryFn: () => Promise<T> }
) => {
  return useQuery({
    ...defaultQueryConfig,
    ...options,
  });
};

// Hook spécifique pour les images avec cache étendu
export const useImageCache = (imageUrl?: string) => {
  return useQuery({
    queryKey: ["image-cache", imageUrl],
    queryFn: async () => {
      if (!imageUrl) return null;
      
      // Précharger l'image et la mettre en cache
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(imageUrl);
        img.onerror = reject;
        img.src = imageUrl;
      });
    },
    enabled: !!imageUrl,
    staleTime: 30 * 60 * 1000, // 30 minutes pour les images
    gcTime: 60 * 60 * 1000, // 1 heure
    retry: 1,
  });
};
