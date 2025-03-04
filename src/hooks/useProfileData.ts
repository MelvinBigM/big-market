
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserProfileData } from "@/types/profile";

export const useProfileData = () => {
  const { session, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();

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
    queryKey: ["userProfile", profile?.id],
    queryFn: async () => {
      if (!profile?.id) {
        console.log("Utilisateur non connecté ou profil non chargé");
        return null;
      }
      
      console.log("Récupération du profil pour l'ID:", profile.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        throw error;
      }
      
      console.log("Données du profil récupérées:", data);
      return data as UserProfileData;
    },
    enabled: !!profile?.id,
    retry: 3,
    retryDelay: 1000,
  });

  // Utiliser useEffect pour mettre à jour le formulaire quand userData change
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
      
      if (!profile?.id) {
        throw new Error("ID utilisateur non disponible");
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", profile.id)
        .select();

      if (error) {
        console.error("Erreur de mise à jour:", error);
        throw error;
      }
      
      console.log("Réponse de mise à jour:", data);
      return data;
    },
    onSuccess: async () => {
      console.log("Mise à jour réussie");
      
      // Invalider le cache de la requête
      queryClient.invalidateQueries({ queryKey: ["userProfile", profile?.id] });
      
      // Rafraîchir le profil dans le contexte d'authentification
      await refreshProfile();
      
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error("Erreur de mise à jour:", error);
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_company: checked }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    console.log("Soumission du formulaire avec les données:", formData);
    updateProfileMutation.mutate(formData);
  };

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
