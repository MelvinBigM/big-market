
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Building2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import AdminProtectedRoute from "./AdminProtectedRoute";

const UserDetailsPage = () => {
  const { userId } = useParams();

  const { data: userDetails, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("User details from DB:", data);
      if (error) throw error;
      return data;
    },
  });

  const { data: userEmail } = useQuery({
    queryKey: ["user-email", userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_profiles_with_email");

      if (error) throw error;
      const userWithEmail = data.find((user: any) => user.id === userId);
      console.log("User email data:", userWithEmail);
      return userWithEmail?.email;
    },
  });

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

  console.log("Final userDetails:", userDetails);
  console.log("Final userEmail:", userEmail);

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <h1 className="text-3xl font-bold text-gray-900">
                  {userDetails.company_name || "Nom de société non défini"}
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
                      <p className="text-sm font-medium text-gray-500">Nom de la société</p>
                      <p className="mt-1">{userDetails.company_name || "Non défini"}</p>
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
                  <CardTitle>Responsable de l'entreprise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Prénom</p>
                      <p className="mt-1">{userDetails.manager_first_name || "Non défini"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom</p>
                      <p className="mt-1">{userDetails.manager_last_name || "Non défini"}</p>
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
