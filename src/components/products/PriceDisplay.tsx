
import { Product } from "@/lib/types";
import { extractQuantity, calculatePriceTTC } from "@/lib/price-utils";
import { AccessRequest } from "@/lib/types";
import { useState } from "react";
import RequestClientAccessDialog from "@/components/RequestClientAccessDialog";

interface PriceDisplayProps {
  product: Product & { categories: { name: string } };
  profile: {
    id: string;
    role: string;
  } | null;
  accessRequest: AccessRequest | null;
}

const PriceDisplay = ({ product, profile, accessRequest }: PriceDisplayProps) => {
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  
  const canSeePrice = profile?.role === 'client' || profile?.role === 'admin';
  const isNewUser = profile?.role === 'nouveau';
  const hasPendingRequest = !!accessRequest;

  // Extract quantity and calculate unit price
  const quantity = extractQuantity(product.name);
  const unitPrice = product.price / quantity;
  
  // Calculate price with VAT using the product's vat_rate
  const vatRate = product.vat_rate || 20;
  const priceTTC = calculatePriceTTC(product.price, vatRate);

  if (canSeePrice) {
    return (
      <div className="text-center space-y-3">
        {/* Main price (larger and in red) */}
        <div className="text-3xl font-bold text-primary">
          {product.price.toFixed(2)} € HT
        </div>
        
        {/* TTC price (smaller below) */}
        <div className="text-gray-500 text-sm">
          {priceTTC.toFixed(2)} € TTC
        </div>
        
        {/* Quantity information */}
        {quantity > 1 && (
          <div className="mt-2 flex flex-col items-center space-y-1">
            <div className="bg-blue-50 inline-block py-1 px-3 rounded-md text-blue-800 font-medium">
              {quantity} par carton
            </div>
            <div className="text-gray-600 text-sm">
              {unitPrice.toFixed(2)} € HT / pièce
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="text-sm text-center">
        {isNewUser ? (
          hasPendingRequest ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
              <p className="text-amber-800 font-medium">
                Votre demande d'accès est en cours d'examen. 
                Vous pourrez voir les prix une fois qu'un administrateur l'aura approuvée.
              </p>
            </div>
          ) : (
            <p className="text-gray-700 mb-2">
              Pour voir les prix : <button
                onClick={() => setShowAccessDialog(true)}
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                demander l'accès client
              </button>
            </p>
          )
        ) : (
          <p className="text-gray-700 italic">
            Connectez-vous en tant que client pour voir le prix
          </p>
        )}
        
        {/* Access dialog */}
        <RequestClientAccessDialog 
          open={showAccessDialog} 
          onOpenChange={setShowAccessDialog}
        />
      </div>
    );
  }
};

export default PriceDisplay;
