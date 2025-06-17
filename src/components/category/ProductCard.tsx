
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/types";
import OptimizedImage from "@/components/ui/optimized-image";

interface ProductCardProps {
  product: Product;
  index: number;
  canSeePrice: boolean;
  isNewUser: boolean;
}

const ProductCard = ({ product, index, canSeePrice, isNewUser }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden h-[220px] sm:h-[240px] flex flex-col relative group cursor-pointer hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="absolute top-2 right-2 z-10">
        <span className={`inline-flex h-3 w-3 rounded-full transition-all duration-200 ${
          product.in_stock ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>
      <div className="w-full h-[110px] sm:h-[125px] bg-white flex items-center justify-center">
        {product.image_url && (
          <OptimizedImage
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-2 sm:p-3"
            fallback="https://images.unsplash.com/photo-1618160472975-cfea543a1077?auto=format&fit=crop&q=80&w=400"
          />
        )}
      </div>
      <div className="p-2 sm:p-3 flex flex-col justify-between flex-grow bg-white">
        <div className="flex-grow flex flex-col">
          <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 text-center leading-tight">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-0.5">
          {canSeePrice ? (
            <div className="flex items-baseline space-x-1 justify-center">
              <span>&nbsp;&nbsp;&nbsp;</span>
              <span className="text-sm sm:text-lg font-bold text-primary">
                {product.price.toFixed(2)} €
              </span>
              <span className="text-xs text-gray-500">HT</span>
            </div>
          ) : (
            <p className="text-xs text-gray-700 text-center leading-tight">
              {isNewUser 
                ? "Prix visibles uniquement pour les clients validés" 
                : "Connexion client requise pour afficher les prix"
              }
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
