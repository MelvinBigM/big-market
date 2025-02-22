
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button } from "../ui/button";
import { ArrowLeft, Building2, User } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { toast } from "sonner";

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: userDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("User not found");
      }

      return data;
    },
    retry: false,
    onError: () => {
      toast.error("Erreur lors du chargement des détails de l'utilisateur");
      navigate("/admin/users");
    }
  });

  const { data: userEmail, isLoading: isLoadingEmail } = useQuery({
    queryKey: ["user-email", userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_profiles_with_email");

      if (error) throw error;
      const userWithEmail = data.find((user: any) => user.id === userId);
      return userWithEmail?.email;
    }
  });

  const isLoading = isLoadingDetails || isLoadingEmail;

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

  if (!userDetails) {
    return null;
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin/users")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
              <div className="flex items-center gap-2">
                {userDetails.is_company ? (
                  <Building2 className="h-6 w-6" />
                ) : (
                  <User className="h-6 w-6" />
                )}
                <h1 className="text-3xl font-bold text-gray-900">
                  {userDetails.full_name}
                </h1>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="mt-1">{userDetails.full_name || "Non défini"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{userEmail || "Non défini"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rôle</p>
                      <p className="mt-1 capitalize">{userDetails.role}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
                      <p className="mt-1">
                        {new Date(userDetails.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <p className="mt-1">{userDetails.phone_number || "Non défini"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse complète</p>
                    <p className="mt-1">{userDetails.address || "Non définie"}</p>
                    {(userDetails.postal_code || userDetails.city) && (
                      <p className="mt-1">
                        {userDetails.postal_code} {userDetails.city}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
};

export default UserDetailsPage;
