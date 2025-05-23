
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AccessRequest } from "@/lib/types";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const AdminAccessRequestsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["access-requests"],
    queryFn: async () => {
      const { data: accessRequests, error: requestsError } = await supabase
        .from("access_requests")
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error("Error fetching access requests:", requestsError);
        toast.error("Erreur lors du chargement des demandes d'accès");
        throw requestsError;
      }

      const userIds = accessRequests?.map(request => request.user_id) || [];
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select('*')
        .in('id', userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast.error("Erreur lors du chargement des profils");
        throw profilesError;
      }

      return accessRequests.map(request => ({
        ...request,
        profiles: profiles?.find(profile => profile.id === request.user_id) || {
          full_name: 'Utilisateur inconnu',
          is_company: false,
          phone_number: '',
          address: '',
          city: '',
          postal_code: '',
        }
      })) as (AccessRequest & {
        profiles: {
          full_name: string | null;
          is_company: boolean | null;
          phone_number: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
        };
      })[];
    }
  });

  const handleRequestAction = async (requestId: string, userId: string, approve: boolean) => {
    try {
      // Mettre à jour le statut de la demande
      const { error: requestError } = await supabase
        .from('access_requests')
        .update({ status: approve ? 'approved' : 'rejected' })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Si approuvé, mettre à jour le rôle de l'utilisateur
      if (approve) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'client' })
          .eq('id', userId);

        if (profileError) throw profileError;
      }

      toast.success(approve ? 'Demande approuvée' : 'Demande rejetée');
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    } catch (error) {
      console.error('Error handling request:', error);
      toast.error("Une erreur est survenue lors du traitement de la demande");
    }
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

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy", { locale: fr });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Demandes d'accès en attente
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests && requests.length > 0 ? (
              requests.map((request) => (
                <Card 
                  key={request.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="cursor-pointer" onClick={() => navigate(`/admin/users/${request.user_id}`)}>
                    <CardTitle className="text-lg">
                      {request.profiles.full_name || 'Utilisateur sans nom'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{request.reason}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Demande effectuée le {formatDate(request.created_at)}
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRequestAction(request.id, request.user_id, false)}
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleRequestAction(request.id, request.user_id, true)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approuver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-6">
                    <p className="text-gray-500">Aucune demande d'accès en attente</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAccessRequestsPage;
