
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/lib/types";
import UserSearch from "./UserSearch";
import UsersList from "./UsersList";

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

        const { data, error } = await supabase.rpc('get_profiles_with_email');
        
        if (error) throw error;
        if (!data) return [];

        // Transform data for UserProfile type
        return data.map((item: any) => ({
          id: item.id,
          role: item.role,
          company_name: item.company_name,
          manager_first_name: item.manager_first_name,
          manager_last_name: item.manager_last_name,
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_company: item.is_company,
          phone_number: item.phone_number,
          address: item.address,
          city: item.city,
          postal_code: item.postal_code,
          email: item.email
        })) as UserProfile[];
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

      // Use the secure role update function with audit logging
      const { error } = await supabase.rpc('update_user_role', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) throw error;

      toast.success(`Le rôle a été mis à jour avec succès`);
      refetch();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast.error(`Erreur lors de la mise à jour du rôle: ${error.message}`);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      if (!profile || profile.role !== 'admin') {
        throw new Error("Action non autorisée");
      }

      const { error } = await supabase.rpc('delete_user', {
        user_id: userId
      }) as { error: any };

      if (error) throw error;

      toast.success("L'utilisateur a été supprimé avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error(error);
    }
  };

  const filteredProfiles = profiles?.filter(profile =>
    (profile.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (profile.company_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
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
      <div className="flex min-h-screen items-center justify-center px-4">
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
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="pt-16 pb-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Gestion des utilisateurs
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <UserSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <UsersList 
              profiles={filteredProfiles}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminUsersPage;
