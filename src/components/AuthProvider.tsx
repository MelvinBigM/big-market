
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

  const fetchProfile = async (userId: string, shouldSetLoading = true) => {
    if (shouldSetLoading) {
      setIsLoading(true);
    }
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        // Don't throw error, just log it
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      // Don't show toast error on profile fetch failure to avoid spam
    } finally {
      if (shouldSetLoading) {
        setIsLoading(false);
      }
    }
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id, false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, 'Session:', !!session);
      
      if (!mounted) return;

      const isResetPasswordPage = location.pathname === '/reset-password';
      
      setSession(session);
      
      if (session?.user && !isResetPasswordPage) {
        // Defer profile fetch to avoid blocking the auth state change
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id, false);
          }
        }, 0);
      } else {
        setProfile(null);
      }
      
      // Always set loading to false after handling auth state
      setIsLoading(false);
      
      // Handle redirect for password reset
      if (event === 'SIGNED_IN' && isResetPasswordPage) {
        console.log('User signed in for password reset - staying on reset page');
        return;
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          setIsLoading(false);
          return;
        }

        if (!mounted) return;

        const isResetPasswordPage = location.pathname === '/reset-password';
        
        setSession(session);
        
        if (session?.user && !isResetPasswordPage) {
          await fetchProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ isLoading, session, profile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
