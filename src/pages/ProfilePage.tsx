
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// Définition du type complet pour les données du profil utilisateur
type UserProfileData = {
  id: string;
  role: 'admin' | 'client' | 'nouveau';
  full_name: string | null;
  created_at: string;
  updated_at: string;
  is_company: boolean | null;
  company_name: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
};

const ProfilePage = () => {
  const { session, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    is_company: profile?.is_company || false,
    company_name: "",
    phone_number: profile?.phone_number || "",
    address: profile?.address || "",
    city: profile?.city || "",
    postal_code: profile?.postal_code || "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Récupérer les détails de l'utilisateur connecté
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile", profile?.id],
    queryFn: async () => {
      if (!profile?.id) throw new Error("Utilisateur non connecté");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      if (error) throw error;
      return data as UserProfileData;
    },
    enabled: !!profile?.id,
  });

  // Utiliser useEffect pour mettre à jour le formulaire quand userData change
  useEffect(() => {
    if (userData) {
      setFormData({
        full_name: userData.full_name || "",
        is_company: userData.is_company || false,
        company_name: userData.company_name || "",
        phone_number: userData.phone_number || "",
        address: userData.address || "",
        city: userData.city || "",
        postal_code: userData.postal_code || "",
      });
    }
  }, [userData]);

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: any) => {
      const { error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", profile?.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", profile?.id] });
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
    },
    onError: (error: any) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (!session) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <p>Chargement des informations...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Ces informations sont utilisées pour les commandes et livraisons
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isEditing ? (
                <form id="profile-form" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nom complet</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Téléphone</Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="is_company" 
                          checked={formData.is_company} 
                          onCheckedChange={handleCheckboxChange}
                        />
                        <Label htmlFor="is_company">Entreprise</Label>
                      </div>
                    </div>

                    {formData.is_company && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="company_name">Nom de l'entreprise</Label>
                        <Input
                          id="company_name"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Adresse</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">Code postal</Label>
                        <Input
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="mt-1">{userData?.full_name || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="mt-1">{userData?.phone_number || "-"}</p>
                    </div>

                    {userData?.is_company && userData?.company_name && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Entreprise</p>
                        <p className="mt-1">{userData.company_name}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-3">Adresse</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Adresse</p>
                        <p className="mt-1">{userData?.address || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ville</p>
                        <p className="mt-1">{userData?.city || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Code postal</p>
                        <p className="mt-1">{userData?.postal_code || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-gray-500">Type de compte</p>
                    <p className="mt-1">
                      {profile?.role === 'admin' 
                        ? 'Administrateur' 
                        : profile?.role === 'client' 
                          ? 'Client validé' 
                          : "Compte en attente d'approbation"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" form="profile-form">
                    Enregistrer
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
