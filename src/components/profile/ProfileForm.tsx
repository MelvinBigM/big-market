
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
        is_company: profile.is_company || false,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("Vous devez être connecté pour modifier votre profil");
      return;
    }

    setIsLoading(true);
    console.log("Updating profile with data:", formData);

    try {
      const updateData = {
        company_name: formData.company_name,
        manager_first_name: formData.manager_first_name,
        manager_last_name: formData.manager_last_name,
        phone_number: formData.phone_number,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        is_company: formData.is_company,
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
        throw error;
      }

      console.log("Profile updated successfully:", data);
      
      toast.success("Profil mis à jour avec succès");
      
      // Reload to refresh the AuthProvider data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string | boolean) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileFormFields 
          formData={formData}
          onInputChange={handleInputChange}
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
