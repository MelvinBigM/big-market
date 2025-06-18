
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Profile } from "@/lib/types";
import ProfileFormFields from "./ProfileFormFields";
import { validateRequired, validatePhone, validatePostalCode, sanitizeInput } from "@/lib/validation";

const ProfileForm = () => {
  const { profile, session, refreshProfile } = useAuth();
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

    // Validate required fields with sanitization
    const firstNameValidation = validateRequired(formData.manager_first_name || "", "Le prénom");
    if (!firstNameValidation.isValid) {
      newErrors.manager_first_name = firstNameValidation.error || "";
    }

    const lastNameValidation = validateRequired(formData.manager_last_name || "", "Le nom");
    if (!lastNameValidation.isValid) {
      newErrors.manager_last_name = lastNameValidation.error || "";
    }

    const companyNameValidation = validateRequired(formData.company_name || "", "Le nom de l'entreprise");
    if (!companyNameValidation.isValid) {
      newErrors.company_name = companyNameValidation.error || "";
    }

    // Validate phone number
    const phoneValidation = validatePhone(formData.phone_number || "");
    if (!phoneValidation.isValid) {
      newErrors.phone_number = phoneValidation.error || "";
    }

    // Validate address
    const addressValidation = validateRequired(formData.address || "", "L'adresse");
    if (!addressValidation.isValid) {
      newErrors.address = addressValidation.error || "";
    }

    // Validate city
    const cityValidation = validateRequired(formData.city || "", "La ville");
    if (!cityValidation.isValid) {
      newErrors.city = cityValidation.error || "";
    }

    // Validate postal code
    const postalCodeValidation = validatePostalCode(formData.postal_code || "");
    if (!postalCodeValidation.isValid) {
      newErrors.postal_code = postalCodeValidation.error || "";
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
      // Sanitize all input data
      const updateData = {
        company_name: sanitizeInput(formData.company_name || ""),
        manager_first_name: sanitizeInput(formData.manager_first_name || ""),
        manager_last_name: sanitizeInput(formData.manager_last_name || ""),
        phone_number: sanitizeInput(formData.phone_number || ""),
        address: sanitizeInput(formData.address || ""),
        city: sanitizeInput(formData.city || ""),
        postal_code: sanitizeInput(formData.postal_code || ""),
        updated_at: new Date().toISOString(),
      };

      console.log("Sending sanitized update to Supabase:", updateData);

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
      
      toast.success("Profil mis à jour avec succès !");
      
      // Refresh profile data instead of reloading the page
      if (refreshProfile) {
        await refreshProfile();
      }
      
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
