
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AccessRequest } from "@/lib/types";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const AdminAccessRequestsPage = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["access-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_requests")
        .select(`
          *,
          profiles:user_id (
            full_name,
            is_company,
            phone_number,
            address,
            city,
            postal_code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching access requests:", error);
        toast.error("Erreur lors du chargement des demandes d'accès");
        throw error;
      }

      return data as (AccessRequest & {
        profiles: {
          full_name: string;
          is_company: boolean;
          phone_number: string;
          address: string;
          city: string;
          postal_code: string;
        };
      })[];
    }
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

  const getStatusIcon = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Demandes d'accès
            </h1>
          </div>

          <div className="space-y-6">
            {requests && requests.length > 0 ? (
              requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {request.profiles.full_name || 'Utilisateur sans nom'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className="text-sm font-medium">
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Informations</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Type : </span>
                            {request.profiles.is_company ? 'Entreprise' : 'Particulier'}
                          </p>
                          <p>
                            <span className="font-medium">Téléphone : </span>
                            {request.profiles.phone_number || 'Non renseigné'}
                          </p>
                          <p>
                            <span className="font-medium">Adresse : </span>
                            {request.profiles.address || 'Non renseignée'}
                          </p>
                          {(request.profiles.postal_code || request.profiles.city) && (
                            <p>
                              {request.profiles.postal_code} {request.profiles.city}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Motif de la demande</h3>
                        <p className="text-sm whitespace-pre-line">{request.reason}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-gray-500">Aucune demande d'accès pour le moment</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAccessRequestsPage;
