
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserProfileData } from "@/types/profile";

export const useProfileData = () => {
  const { session, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const userId = profile?.id;

  // État initial du formulaire
  const [formData, setFormData] = useState({
    full_name: "",
    is_company: false,
    phone_number: "",
    address: "",
    city: "",
    postal_code: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Récupérer les détails de l'utilisateur connecté
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) {
        console.log("Utilisateur non connecté ou profil non chargé");
        return null;
      }
      
      console.log("Récupération du profil pour l'ID:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        throw error;
      }
      
      console.log("Données du profil récupérées:", data);
      return data as UserProfileData;
    },
    enabled: !!userId,
  });

  // Mettre à jour le formulaire quand userData change
  useEffect(() => {
    if (userData) {
      console.log("Mise à jour du formulaire avec les données:", userData);
      setFormData({
        full_name: userData.full_name || "",
        is_company: userData.is_company || false,
        phone_number: userData.phone_number || "",
        address: userData.address || "",
        city: userData.city || "",
        postal_code: userData.postal_code || "",
      });
    }
  }, [userData]);

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfileData>) => {
      console.log("Envoi des données de mise à jour:", updatedProfile);
      
      if (!userId) {
        throw new Error("ID utilisateur non disponible");
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", userId);

      if (error) {
        console.error("Erreur de mise à jour:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: async () => {
      // Rafraîchir les données
      await refreshProfile();
      
      // Invalider le cache de la requête pour forcer un nouveau chargement
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      
      // Afficher un message de succès
      toast.success("Profil mis à jour avec succès");
      
      // Fermer le mode édition
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error("Erreur de mise à jour:", error);
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    },
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, is_company: checked }));
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Soumission du formulaire avec les données:", formData);
    updateProfileMutation.mutate(formData);
  }, [formData, updateProfileMutation]);

  return {
    userData,
    formData,
    isLoading,
    isEditing,
    setIsEditing,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit
  };
};
