
import React from "react";
import { Banner } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useIsMobile } from "@/hooks/use-mobile";

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onReorder: (result: any) => void;
}

const BannerList: React.FC<BannerListProps> = ({ 
  banners, 
  onEdit, 
  onDelete, 
  onToggleActive,
  onReorder 
}) => {
  const isMobile = useIsMobile();

  if (banners.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 px-4">
        Aucune bannière photo disponible. Créez votre première bannière photo.
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId="banners">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3 sm:space-y-4"
            >
              {banners.map((banner, index) => (
                <Draggable
                  key={banner.id}
                  draggableId={banner.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`border rounded-lg overflow-hidden shadow-sm ${
                        !banner.active ? 'opacity-60' : ''
                      } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    >
                      {/* Full banner preview */}
                      <div className="w-full h-24 sm:h-32 bg-gray-200 relative overflow-hidden">
                        {banner.image_url && (
                          <img 
                            src={banner.image_url} 
                            alt={banner.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Banner info and actions */}
                      <div className={`p-3 sm:p-4 bg-white ${
                        isMobile ? 'space-y-3' : 'flex items-center justify-between'
                      }`}>
                        <div 
                          {...provided.dragHandleProps}
                          className={`${isMobile ? 'flex items-center' : 'flex items-center flex-1'} cursor-move`}
                        >
                          <div className="mr-3 text-gray-400">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                              <circle cx="5" cy="6" r="1"/>
                              <circle cx="15" cy="6" r="1"/>
                              <circle cx="5" cy="10" r="1"/>
                              <circle cx="15" cy="10" r="1"/>
                              <circle cx="5" cy="14" r="1"/>
                              <circle cx="15" cy="14" r="1"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-base sm:text-lg truncate">{banner.title}</h3>
                          </div>
                        </div>
                        
                        <div className={`${
                          isMobile ? 'flex flex-col space-y-3' : 'flex items-center space-x-4 ml-4'
                        }`}>
                          <div className={`${
                            isMobile ? 'flex items-center justify-between' : 'flex items-center space-x-2'
                          }`}>
                            <span className="text-sm text-gray-600">
                              {banner.active ? 'Active' : 'Inactive'}
                            </span>
                            <Switch
                              checked={banner.active}
                              onCheckedChange={(checked) => onToggleActive(banner.id, checked)}
                            />
                          </div>
                          
                          <div className={`${
                            isMobile ? 'flex space-x-2 w-full' : 'flex space-x-2'
                          }`}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => onEdit(banner)}
                              className={isMobile ? 'flex-1 text-xs' : ''}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              {isMobile ? 'Modif.' : 'Modifier'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className={`text-destructive hover:text-destructive ${
                                isMobile ? 'flex-1 text-xs' : ''
                              }`}
                              onClick={() => onDelete(banner.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {isMobile ? 'Suppr.' : 'Supprimer'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BannerList;
