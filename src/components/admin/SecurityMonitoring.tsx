
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Shield, AlertTriangle, Users, Activity, Eye, Lock, Zap } from "lucide-react";
import { Badge } from "../ui/badge";

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

  const { data: securityEvents } = useQuery({
    queryKey: ["security-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("security_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    refetchInterval: 15000, // Refresh every 15 seconds
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

  const formatSecurityEventType = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return 'Connexion réussie';
      case 'login_failure':
        return 'Échec de connexion';
      case 'rate_limit_exceeded':
        return 'Limite de taux dépassée';
      case 'suspicious_activity':
        return 'Activité suspecte';
      case 'admin_action':
        return 'Action administrative';
      case 'authentication_error':
        return 'Erreur d\'authentification';
      default:
        return eventType;
    }
  };

  const getEventSeverity = (eventType: string) => {
    switch (eventType) {
      case 'rate_limit_exceeded':
      case 'suspicious_activity':
      case 'authentication_error':
        return 'high';
      case 'login_failure':
        return 'medium';
      case 'admin_action':
        return 'info';
      default:
        return 'low';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'info':
        return 'default';
      default:
        return 'outline';
    }
  };

  // Calculate security metrics
  const recentSecurityEvents = securityEvents?.slice(0, 10) || [];
  const highSeverityEvents = securityEvents?.filter(event => 
    getEventSeverity(event.event_type) === 'high'
  ).length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Surveillance de Sécurité Avancée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  RLS Sécurisée
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Politiques de sécurité niveau ligne activées
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Audit Complet
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {auditLogs?.length || 0} actions récentes surveillées
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  Rate Limiting+
                </span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                Protection avancée contre les attaques
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  Alertes Sécurité
                </span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                {highSeverityEvents} événements haute priorité
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Audit Log */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Journal d'Audit Administratif
              </h3>
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

            {/* Security Events */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Événements de Sécurité
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentSecurityEvents.map((event) => (
                  <div key={event.id} className={`p-3 rounded border-l-4 ${
                    getEventSeverity(event.event_type) === 'high' ? 'bg-red-50 border-red-500' :
                    getEventSeverity(event.event_type) === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-gray-50 border-gray-500'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">
                            {formatSecurityEventType(event.event_type)}
                          </p>
                          <Badge variant={getSeverityColor(getEventSeverity(event.event_type))}>
                            {getEventSeverity(event.event_type)}
                          </Badge>
                        </div>
                        {event.user_agent && (
                          <p className="text-xs text-gray-600 truncate">
                            User Agent: {event.user_agent}
                          </p>
                        )}
                        {event.details && (
                          <p className="text-xs text-gray-500 mt-1">
                            {JSON.stringify(event.details)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {recentSecurityEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucun événement de sécurité récent
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitoring;
