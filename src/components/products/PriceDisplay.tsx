
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
      <div className="text-left space-y-6 mt-8">
        {/* Prices side by side */}
        <div className="flex justify-between items-baseline">
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-primary">{product.price.toFixed(2)}€</div>
            <div className="text-sm text-gray-500">HT</div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-xl text-gray-600">{priceTTC.toFixed(2)}€</div>
            <div className="text-sm text-gray-500">TTC</div>
          </div>
        </div>
        
        {/* Quantity information below */}
        {quantity > 1 && (
          <div className="flex flex-col space-y-1 mt-4 border-t pt-4 border-gray-200">
            <div className="text-gray-700 font-medium">
              {quantity} par carton
            </div>
            <div className="text-gray-600 text-sm">
              {unitPrice.toFixed(2)}€ HT/pièce
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
