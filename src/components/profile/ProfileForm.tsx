
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Profile } from "@/lib/types";
import ProfileFormFields from "./ProfileFormFields";

const ProfileForm = () => {
  const { profile, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      console.log("Profile loaded:", profile);
      setFormData({
        company_name: profile.company_name || "",
        manager_first_name: profile.manager_first_name || "",
        manager_last_name: profile.manager_last_name || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        city: profile.city || "",
        postal_code: profile.postal_code || "",
      });
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation prénom
    if (!formData.manager_first_name?.trim()) {
      newErrors.manager_first_name = "Le prénom est obligatoire";
    } else if (formData.manager_first_name.trim().length < 2) {
      newErrors.manager_first_name = "Le prénom doit contenir au moins 2 caractères";
    }

    // Validation nom
    if (!formData.manager_last_name?.trim()) {
      newErrors.manager_last_name = "Le nom est obligatoire";
    } else if (formData.manager_last_name.trim().length < 2) {
      newErrors.manager_last_name = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation nom d'entreprise
    if (!formData.company_name?.trim()) {
      newErrors.company_name = "Le nom de l'entreprise est obligatoire";
    } else if (formData.company_name.trim().length < 2) {
      newErrors.company_name = "Le nom de l'entreprise doit contenir au moins 2 caractères";
    }

    // Validation téléphone
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Le numéro de téléphone est obligatoire";
    } else if (!phoneRegex.test(formData.phone_number.replace(/\s/g, ""))) {
      newErrors.phone_number = "Le numéro de téléphone n'est pas valide (format français attendu)";
    }

    // Validation adresse
    if (!formData.address?.trim()) {
      newErrors.address = "L'adresse est obligatoire";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "L'adresse doit contenir au moins 5 caractères";
    }

    // Validation ville
    if (!formData.city?.trim()) {
      newErrors.city = "La ville est obligatoire";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "La ville doit contenir au moins 2 caractères";
    }

    // Validation code postal
    const postalCodeRegex = /^[0-9]{5}$/;
    if (!formData.postal_code?.trim()) {
      newErrors.postal_code = "Le code postal est obligatoire";
    } else if (!postalCodeRegex.test(formData.postal_code)) {
      newErrors.postal_code = "Le code postal doit contenir exactement 5 chiffres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    if (!session?.user?.id) {
      toast.error("Vous devez être connecté pour modifier votre profil");
      return;
    }

    setIsLoading(true);
    console.log("Updating profile with data:", formData);

    try {
      const updateData = {
        company_name: formData.company_name?.trim(),
        manager_first_name: formData.manager_first_name?.trim(),
        manager_last_name: formData.manager_last_name?.trim(),
        phone_number: formData.phone_number?.trim(),
        address: formData.address?.trim(),
        city: formData.city?.trim(),
        postal_code: formData.postal_code?.trim(),
        updated_at: new Date().toISOString(),
      };

      console.log("Sending update to Supabase:", updateData);

      const { data, error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        
        let errorMessage = "Erreur lors de la mise à jour du profil";
        if (error.code === "23505") {
          errorMessage = "Ces informations sont déjà utilisées par un autre utilisateur";
        } else if (error.code === "42501") {
          errorMessage = "Vous n'avez pas les permissions pour effectuer cette action";
        } else if (error.message) {
          errorMessage += `: ${error.message}`;
        }
        
        toast.error(errorMessage);
        return;
      }

      console.log("Profile updated successfully:", data);
      
      toast.success("Profil mis à jour avec succès ! La page va se recharger pour appliquer les modifications.");
      
      // Reload to refresh the AuthProvider data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      let errorMessage = "Erreur inattendue lors de la mise à jour du profil";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string | boolean) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileFormFields 
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Mise à jour..." : "Sauvegarder"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
