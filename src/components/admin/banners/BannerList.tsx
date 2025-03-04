
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
    <div className="space-y-4">
      {banners.map((banner) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center border rounded-lg p-4 hover:bg-gray-50"
        >
          <div className="mr-4 h-16 w-28 bg-gray-200 rounded overflow-hidden">
            {banner.image_url ? (
              <img 
                src={banner.image_url} 
                alt={banner.title} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`h-full w-full ${banner.bgColor}`} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{banner.title}</h3>
            <p className="text-sm text-gray-500 truncate">{banner.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="text-xs" onClick={() => onEdit(banner)}>
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button size="sm" variant="outline" className="text-xs text-destructive" onClick={() => onDelete(banner.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BannerList;
