
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
    console.log("AuthProvider initialisé");
    
    // Fonction pour récupérer la session et le profil
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Récupérer la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur lors de la récupération de la session:", sessionError);
          throw sessionError;
        }
        
        console.log("Session récupérée:", session ? "Connecté" : "Non connecté");
        setSession(session);
        
        // Si utilisateur connecté, récupérer son profil
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error);
        setIsLoading(false);
      }
    };
    
    // Initialiser l'authentification au chargement
    initializeAuth();
    
    // Configurer les écouteurs d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Changement d'état d'authentification:", _event);
        setSession(session);
        
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Nettoyer l'abonnement
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
        throw error;
      }

      if (data) {
        console.log("Profil récupéré:", data.role);
        setProfile(data as Profile);
      }
    } catch (error: any) {
      toast.error("Erreur lors du chargement du profil");
      console.error("Error fetching profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("État de l'authentification:", { isLoading, isAuthenticated: !!session });

  return (
    <AuthContext.Provider value={{ isLoading, session, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
