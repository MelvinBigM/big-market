
import React from "react";
import { Banner } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const BannerList: React.FC<BannerListProps> = ({ banners, onEdit, onDelete, onToggleActive }) => {
  if (banners.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune bannière photo disponible. Créez votre première bannière photo.
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
          className={`border rounded-lg overflow-hidden shadow-sm ${!banner.active ? 'opacity-60' : ''}`}
        >
          {/* Full banner preview */}
          <div className="w-full h-32 bg-gray-200 relative overflow-hidden">
            {banner.image_url && (
              <img 
                src={banner.image_url} 
                alt={banner.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Banner info and actions */}
          <div className="p-4 bg-white flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{banner.title}</h3>
              <p className="text-sm text-gray-500">{banner.description}</p>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
                <Switch
                  checked={banner.active}
                  onCheckedChange={(checked) => onToggleActive(banner.id, checked)}
                />
              </div>
              <div className="flex space-x-2">
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
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BannerList;
