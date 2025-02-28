
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, isAuthenticated } from "@/lib/auth";
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
import { Skeleton } from "@/components/ui/skeleton";

// Définition du type complet pour les données du profil utilisateur
type UserProfileData = {
  id: string;
  role: 'admin' | 'client' | 'nouveau';
  full_name: string | null;
  created_at: string;
  updated_at: string;
  is_company: boolean | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
};

const ProfilePage = () => {
  const { session, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isUserAuthenticated = isAuthenticated({ isLoading: authLoading, session, profile });

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

  // Récupérer les détails de l'utilisateur connecté uniquement si authentifié
  const { data: userData, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", profile?.id],
    queryFn: async () => {
      if (!profile?.id) {
        throw new Error("Utilisateur non connecté");
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
    enabled: !!profile?.id, // Ne pas exécuter la requête si le profil n'est pas disponible
    retry: 1,
    staleTime: 30000, // 30 secondes
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
    mutationFn: async (updatedProfile: any) => {
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
    onSuccess: (data) => {
      console.log("Mise à jour réussie:", data);
      queryClient.invalidateQueries({ queryKey: ["userProfile", profile?.id] });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission du formulaire avec les données:", formData);
    updateProfileMutation.mutate(formData);
  };

  // Redirection si non connecté après le chargement
  useEffect(() => {
    if (!authLoading && !session) {
      console.log("Redirection vers la page de connexion - aucune session");
      navigate("/login");
    }
  }, [authLoading, session, navigate]);

  // Si en cours de chargement, afficher un indicateur de chargement
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <p>Vérification de l'authentification...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si non connecté (après vérification), ne rien rendre
  // La redirection sera gérée par l'effet ci-dessus
  if (!session) {
    return null;
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
              {profileLoading ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Skeleton className="h-5 w-32 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : isEditing ? (
                <form id="profile-form" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="full_name">
                        {formData.is_company ? "Nom de l'entreprise" : "Nom complet"}
                      </Label>
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
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">
                        {userData?.is_company ? "Nom de l'entreprise" : "Nom complet"}
                      </p>
                      <p className="mt-1">{userData?.full_name || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="mt-1">{userData?.phone_number || "-"}</p>
                    </div>
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
