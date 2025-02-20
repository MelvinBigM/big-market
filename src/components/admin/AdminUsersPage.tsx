
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Mail, Trash2 } from "lucide-react";

const AdminUsersPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();

  const { data: profiles, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client");

      if (error) throw error;
      
      // Récupérer les utilisateurs depuis l'API Auth
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;

      // Combiner les données des profils avec les emails des utilisateurs
      return profiles.map(profile => {
        const user = users.find(u => u.id === profile.id);
        return {
          ...profile,
          email: user?.email || "Email non trouvé"
        };
      });
    },
  });

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
    }
  }, [profile, isLoading, navigate]);

  const handleCreateUser = async () => {
    // Cette fonction sera implémentée plus tard
    toast.info("Fonctionnalité à venir");
  };

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

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png" 
                alt="Big Market Logo" 
                className="h-12 w-12"
              />
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des clients
              </h1>
            </div>
            <Button onClick={handleCreateUser}>
              <UserPlus className="h-5 w-5 mr-2" />
              Créer un compte client
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid gap-4">
              {profiles?.map((userProfile) => (
                <div
                  key={userProfile.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{userProfile.email}</h3>
                      <p className="text-sm text-gray-600">
                        Client depuis le {new Date(userProfile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast.info("Fonctionnalité à venir");
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast.info("Fonctionnalité à venir");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {profiles?.length === 0 && (
                <p className="text-center text-gray-600 py-4">
                  Aucun client enregistré pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminUsersPage;
