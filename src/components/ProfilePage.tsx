
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Profile } from "@/lib/types";

const ProfilePage = () => {
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
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Profile updated successfully:", data);
      toast.success("Profil mis à jour avec succès");
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

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Accès non autorisé
            </h1>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manager_first_name">Prénom</Label>
                  <Input
                    id="manager_first_name"
                    type="text"
                    value={formData.manager_first_name || ""}
                    onChange={(e) => handleInputChange("manager_first_name", e.target.value)}
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="manager_last_name">Nom</Label>
                  <Input
                    id="manager_last_name"
                    type="text"
                    value={formData.manager_last_name || ""}
                    onChange={(e) => handleInputChange("manager_last_name", e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_name">Nom de l'entreprise</Label>
                <Input
                  id="company_name"
                  type="text"
                  value={formData.company_name || ""}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Téléphone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number || ""}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Votre adresse"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Votre ville"
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Code postal</Label>
                  <Input
                    id="postal_code"
                    type="text"
                    value={formData.postal_code || ""}
                    onChange={(e) => handleInputChange("postal_code", e.target.value)}
                    placeholder="Code postal"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_company"
                  checked={formData.is_company || false}
                  onChange={(e) => handleInputChange("is_company", e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_company">Je représente une entreprise</Label>
              </div>

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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
