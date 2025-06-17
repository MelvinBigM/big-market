
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductsGridProps {
  products: Product[];
  canSeePrice: boolean;
  isNewUser: boolean;
  searchQuery: string;
}

const ProductsGrid = ({ products, canSeePrice, isNewUser, searchQuery }: ProductsGridProps) => {
  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-600">
          {searchQuery 
            ? "Aucun produit ne correspond à votre recherche." 
            : "Aucun produit n'est disponible dans cette catégorie pour le moment."
          }
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          canSeePrice={canSeePrice}
          isNewUser={isNewUser}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
