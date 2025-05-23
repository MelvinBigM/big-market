
import React from "react";
import { Banner } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

const BannerList: React.FC<BannerListProps> = ({ banners, onEdit, onDelete }) => {
  if (banners.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune bannière disponible. Créez votre première bannière.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {banners.map((banner) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="border rounded-lg overflow-hidden shadow-sm"
        >
          {/* Full banner preview */}
          <div className="w-full h-64 bg-gray-200 relative overflow-hidden">
            {banner.image_url ? (
              <img 
                src={banner.image_url} 
                alt={banner.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${banner.bgColor} ${banner.text_color}`}>
                <div className="text-center px-4">
                  <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-lg opacity-90">{banner.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Banner info and actions */}
          <div className="p-4 bg-white flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{banner.title}</h3>
              <p className="text-sm text-gray-500">{banner.description}</p>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button size="sm" variant="outline" onClick={() => onEdit(banner)}>
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => onDelete(banner.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BannerList;
