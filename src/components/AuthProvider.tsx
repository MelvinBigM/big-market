
import { useEffect, useState } from "react";
import { AuthContext } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer la session actuelle au chargement initial
    const getInitialSession = async () => {
      try {
        console.log("Récupération de la session initiale...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur lors de la récupération de la session:", error);
          setIsLoading(false);
          return;
        }
        
        setSession(data.session);
        
        if (data.session) {
          console.log("Session trouvée, récupération du profil pour:", data.session.user.id);
          await fetchProfile(data.session.user.id);
        } else {
          console.log("Aucune session trouvée");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error);
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Configurer l'écouteur pour les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Changement d'état d'authentification:", event);
        
        setSession(currentSession);
        
        if (currentSession) {
          console.log("Nouvelle session, récupération du profil pour:", currentSession.user.id);
          await fetchProfile(currentSession.user.id);
        } else {
          console.log("Session terminée");
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Récupération du profil pour l'utilisateur:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du profil:", error);
        // Continuer même en cas d'erreur
      }

      if (data) {
        console.log("Profil récupéré:", data);
        setProfile(data as Profile);
      } else {
        console.warn("Aucun profil trouvé pour l'utilisateur:", userId);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement du profil:", error.message);
    } finally {
      // Toujours terminer le chargement, même en cas d'erreur
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, session, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
