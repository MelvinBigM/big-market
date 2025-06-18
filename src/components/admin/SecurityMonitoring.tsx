
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Shield, AlertTriangle, Users, Activity } from "lucide-react";

const SecurityMonitoring = () => {
  const { data: auditLogs } = useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_audit_log")
        .select(`
          *,
          profiles:admin_id (
            company_name,
            manager_first_name,
            manager_last_name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatActionType = (actionType: string) => {
    switch (actionType) {
      case 'role_change':
        return 'Changement de rôle';
      case 'user_delete':
        return 'Suppression utilisateur';
      case 'data_access':
        return 'Accès aux données';
      default:
        return actionType;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Surveillance de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Sécurité Active
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                RLS activée sur toutes les tables
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Audit Activé
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Actions administratives surveillées
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  Rate Limiting
                </span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                Protection contre les attaques par force brute
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Journal d'Audit Récent</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs?.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {formatActionType(log.action_type)}
                      </p>
                      <p className="text-xs text-gray-600">
                        par {(log.profiles as any)?.manager_first_name} {(log.profiles as any)?.manager_last_name} 
                        ({(log.profiles as any)?.company_name})
                      </p>
                      {log.details && (
                        <p className="text-xs text-gray-500 mt-1">
                          Détails: {JSON.stringify(log.details)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {(!auditLogs || auditLogs.length === 0) && (
                <p className="text-gray-500 text-center py-4">
                  Aucune action administrative récente
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitoring;
