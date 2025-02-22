
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import type { AccessRequest } from "@/lib/types";

type RequestWithProfile = {
  id: string;
  user_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
  } | null;
};

const AccessRequestsPage = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<(AccessRequest & { user_full_name: string | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
      toast.error("Accès non autorisé");
    }
  }, [profile, isLoading, navigate]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select(`
          id,
          user_id,
          reason,
          status,
          created_at,
          updated_at,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = data as RequestWithProfile[];
      
      setRequests(typedData.map(request => ({
        id: request.id,
        user_id: request.user_id,
        reason: request.reason,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at,
        user_full_name: request.profiles?.full_name || null
      })));
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error: updateError } = await supabase
        .from('access_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (updateError) throw updateError;

      if (newStatus === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'client' })
            .eq('id', request.user_id);

          if (profileError) throw profileError;
        }
      }

      toast.success(`Demande ${newStatus === 'approved' ? 'approuvée' : 'rejetée'} avec succès`);
      fetchRequests();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  if (isLoading || !profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Demandes d'accès</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">Aucune demande d'accès en attente</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {request.user_full_name || "Utilisateur inconnu"}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status === 'pending' 
                        ? 'En attente' 
                        : request.status === 'approved'
                        ? 'Approuvée'
                        : 'Rejetée'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{request.reason}</p>
                  <p className="text-sm text-gray-500">
                    Demande créée le {new Date(request.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {request.status === 'pending' && (
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AccessRequestsPage;
