
import { useEffect, useState } from "react";
import { AuthContext } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/lib/types";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Vérifier si nous sommes sur la page de réinitialisation de mot de passe
      const isResetPasswordPage = location.pathname === '/reset-password';
      
      setSession(session);
      if (session && !isResetPasswordPage) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const isResetPasswordPage = location.pathname === '/reset-password';
      
      console.log('Auth state change:', event, 'on page:', location.pathname);
      
      setSession(session);
      
      if (session && !isResetPasswordPage) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
      
      // Ne pas rediriger automatiquement si on est sur la page de reset password
      if (event === 'SIGNED_IN' && isResetPasswordPage) {
        console.log('User signed in for password reset - staying on reset page');
        return;
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error: any) {
      toast.error("Erreur lors du chargement du profil");
      console.error("Error fetching profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, session, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
