
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Image, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Banner } from "@/lib/types";

const AdminBannersPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
      toast.error("Accès non autorisé");
    } else {
      fetchBanners();
    }
  }, [profile, isLoading, navigate]);

  const fetchBanners = async () => {
    try {
      // Use any to work around type issues temporarily
      const { data, error } = await (supabase as any)
        .from('banners')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setBanners(data as Banner[] || []);
    } catch (error) {
      console.error("Erreur lors du chargement des bannières:", error);
      toast.error("Impossible de charger les bannières");
    }
  };

  const openDialog = (banner?: Banner) => {
    if (banner) {
      setSelectedBanner(banner);
    } else {
      setSelectedBanner({
        id: '',
        title: '',
        description: '',
        image_url: null,
        bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        text_color: 'text-white',
        position: banners.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Le fichier doit être une image");
        return;
      }

      // Max size: 2MB
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      if (selectedBanner) {
        setSelectedBanner({
          ...selectedBanner,
          image_url: data.publicUrl
        });
      }

      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!selectedBanner || !selectedBanner.title) {
      toast.error("Le titre est obligatoire");
      return;
    }

    setIsSaving(true);
    console.log("Saving banner:", selectedBanner); // Debug log

    try {
      const updatedBanner = {
        ...selectedBanner,
        updated_at: new Date().toISOString()
      };

      // Make sure we're working with a proper banner object
      const bannerToSave = {
        title: updatedBanner.title,
        description: updatedBanner.description,
        image_url: updatedBanner.image_url,
        bgcolor: updatedBanner.bgColor, // Note: column name is bgcolor, not bgColor
        text_color: updatedBanner.text_color,
        position: updatedBanner.position,
        updated_at: updatedBanner.updated_at
      };

      if (selectedBanner.id) {
        // Update existing banner
        const { error, data } = await (supabase as any)
          .from('banners')
          .update(bannerToSave)
          .eq('id', selectedBanner.id)
          .select();

        if (error) throw error;
        console.log("Updated banner:", data); // Debug log
        toast.success("Bannière mise à jour");
      } else {
        // Create new banner
        const { error, data } = await (supabase as any)
          .from('banners')
          .insert({
            ...bannerToSave,
            created_at: new Date().toISOString()
          })
          .select();

        if (error) throw error;
        console.log("Created banner:", data); // Debug log
        toast.success("Bannière créée");
      }

      setIsDialogOpen(false);
      await fetchBanners(); // Refresh the banners list
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error(`Impossible d'enregistrer la bannière: ${error.message || "Erreur inconnue"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette bannière ?")) return;

    try {
      const { error } = await (supabase as any)
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Bannière supprimée");
      fetchBanners();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer la bannière");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des bannières
          </h1>
          <Button onClick={() => openDialog()}>
            <Plus className="h-5 w-5 mr-2" />
            Ajouter une bannière
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Bannières actives</h2>
          <p className="text-gray-600 mb-6">
            Gérez les bannières qui apparaissent sur la page d'accueil. Les bannières sont affichées dans l'ordre de leur position.
            Dimensions recommandées: 1920x500 pixels.
          </p>

          {banners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune bannière disponible. Créez votre première bannière.
            </div>
          ) : (
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
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => openDialog(banner)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs text-destructive" onClick={() => handleDeleteBanner(banner.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedBanner?.id ? 'Modifier' : 'Ajouter'} une bannière</DialogTitle>
            <DialogDescription>
              Personnalisez votre bannière qui sera affichée sur la page d'accueil.
              Dimensions recommandées: 1920x500 pixels.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={selectedBanner?.title || ''}
                onChange={(e) => setSelectedBanner(prev => prev ? {...prev, title: e.target.value} : null)}
                placeholder="Titre de la bannière"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={selectedBanner?.description || ''}
                onChange={(e) => setSelectedBanner(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="Description de la bannière"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                min="1"
                value={selectedBanner?.position || 1}
                onChange={(e) => setSelectedBanner(prev => prev ? {...prev, position: parseInt(e.target.value)} : null)}
              />
            </div>

            <div className="space-y-2">
              <Label>Image de fond</Label>
              <div className="mt-1 flex items-center">
                <div className="h-36 w-full bg-gray-200 rounded overflow-hidden">
                  {selectedBanner?.image_url ? (
                    <img
                      src={selectedBanner.image_url}
                      alt="Aperçu"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`h-full w-full flex justify-center items-center ${selectedBanner?.bgColor}`}>
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Label htmlFor="image" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Image className="h-4 w-4 mr-2" />
                  {isUploading ? 'Téléchargement...' : 'Choisir une image'}
                </Label>
                <Input
                  id="image"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
            </div>

            {!selectedBanner?.image_url && (
              <div className="space-y-2">
                <Label htmlFor="bgColor">Couleur de fond (si pas d'image)</Label>
                <select
                  id="bgColor"
                  value={selectedBanner?.bgColor || ''}
                  onChange={(e) => setSelectedBanner(prev => prev ? {...prev, bgColor: e.target.value} : null)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2"
                >
                  <option value="bg-gradient-to-r from-blue-50 to-indigo-50">Bleu</option>
                  <option value="bg-gradient-to-r from-amber-50 to-yellow-50">Jaune</option>
                  <option value="bg-gradient-to-r from-green-50 to-emerald-50">Vert</option>
                  <option value="bg-gradient-to-r from-red-50 to-rose-50">Rouge</option>
                  <option value="bg-gradient-to-r from-purple-50 to-pink-50">Violet</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="text_color">Couleur du texte</Label>
              <Select
                value={selectedBanner?.text_color || 'text-white'}
                onValueChange={(value) => setSelectedBanner(prev => prev ? {...prev, text_color: value} : null)}
              >
                <SelectTrigger id="text_color">
                  <SelectValue placeholder="Choisir une couleur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-white">Blanc</SelectItem>
                  <SelectItem value="text-black">Noir</SelectItem>
                  <SelectItem value="text-blue-600">Bleu</SelectItem>
                  <SelectItem value="text-yellow-600">Jaune</SelectItem>
                  <SelectItem value="text-green-600">Vert</SelectItem>
                  <SelectItem value="text-red-600">Rouge</SelectItem>
                  <SelectItem value="text-purple-600">Violet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveBanner} disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminBannersPage;
