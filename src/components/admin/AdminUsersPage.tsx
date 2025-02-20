
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Mail, Trash2, Search } from "lucide-react";
import { Profile } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile extends Profile {
  email: string | null;
}

const AdminUsersPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
      toast.error("Accès non autorisé");
      return;
    }
  }, [profile, isLoading, navigate]);

  const { data: profiles, refetch, isError, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      try {
        if (!profile || profile.role !== 'admin') {
          throw new Error("Accès non autorisé");
        }

        console.log("Début de la requête get_profiles_with_email");
        const { data, error } = await supabase.rpc('get_profiles_with_email');
        
        console.log("Réponse complète:", { data, error });

        if (error) {
          console.error("Erreur détaillée:", error);
          throw error;
        }

        if (!data) {
          console.log("Aucune donnée reçue");
          return [];
        }

        console.log("Données des profils reçues:", data);
        return data as UserProfile[];
      } catch (error) {
        console.error("Erreur attrapée dans queryFn:", error);
        throw error;
      }
    },
    enabled: !!profile && profile.role === 'admin',
    retry: 1,
  });

  const handleRoleChange = async (userId: string, newRole: 'nouveau' | 'client' | 'admin') => {
    try {
      if (!profile || profile.role !== 'admin') {
        throw new Error("Action non autorisée");
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Le rôle a été mis à jour avec succès`);
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle");
      console.error(error);
    }
  };

  const filteredProfiles = profiles?.filter(profile =>
    (profile.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    profile.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p>Une erreur est survenue lors du chargement des utilisateurs.</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Erreur inconnue'}</p>
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
                Gestion des utilisateurs
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher un utilisateur par email ou rôle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredProfiles && filteredProfiles.length > 0 ? (
                filteredProfiles.map((userProfile) => (
                  <div
                    key={userProfile.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{userProfile.email || 'Email non défini'}</h3>
                        <p className="text-sm text-gray-600">
                          Inscrit le {new Date(userProfile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Select
                        value={userProfile.role}
                        onValueChange={(value: 'nouveau' | 'client' | 'admin') => 
                          handleRoleChange(userProfile.id, value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nouveau">Nouveau</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                        </SelectContent>
                      </Select>
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
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 py-4">
                  Aucun utilisateur trouvé.
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
