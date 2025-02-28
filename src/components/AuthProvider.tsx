
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

  // Fonction pour récupérer le profil utilisateur
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
        throw error;
      }

      if (data) {
        console.log("Profil récupéré avec succès:", data.role);
        setProfile(data as Profile);
      } else {
        console.warn("Aucun profil trouvé pour l'utilisateur:", userId);
        setProfile(null);
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement du profil:", error.message);
      // Ne pas afficher de toast ici, car cela pourrait être gênant lors du chargement initial
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔒 Initialisation de l'authentification");
    
    // Configurer l'écouteur pour les changements d'état d'authentification
    // Cela doit être fait avant getSession pour éviter les problèmes de course
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("🔄 Changement d'état d'authentification:", event, currentSession ? "Session présente" : "Pas de session");
        
        // Mettre à jour l'état de la session
        setSession(currentSession);
        
        if (currentSession) {
          // Si une session existe, récupérer le profil
          await fetchProfile(currentSession.user.id);
        } else {
          // Si pas de session, réinitialiser le profil et terminer le chargement
          setProfile(null);
          setIsLoading(false);
        }
      }
    );
    
    // Vérifier s'il existe déjà une session active
    const checkExistingSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Erreur lors de la récupération de la session:", error);
          setIsLoading(false);
          return;
        }
        
        console.log("📝 Vérification de session existante:", data.session ? "Session trouvée" : "Pas de session");
        
        if (data.session) {
          // Ne pas appeler setSession ici pour éviter une double mise à jour
          // L'écouteur onAuthStateChange s'en chargera
          await fetchProfile(data.session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("❌ Erreur lors de l'initialisation de l'auth:", error);
        setIsLoading(false);
      }
    };
    
    // Vérifier la session existante
    checkExistingSession();
    
    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      console.log("🧹 Nettoyage de l'écouteur d'authentification");
      authListener.subscription.unsubscribe();
    };
  }, []);

  console.log("🔐 État actuel de l'authentification:", { 
    isLoading, 
    isAuthenticated: !!session,
    userId: session?.user?.id,
    role: profile?.role
  });

  return (
    <AuthContext.Provider value={{ isLoading, session, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
