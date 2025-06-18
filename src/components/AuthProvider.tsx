
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
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
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

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          if (mounted) {
            setSession(null);
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }

        if (!mounted) return;

        const isResetPasswordPage = location.pathname === '/reset-password';
        
        console.log('Initial session:', !!initialSession);
        setSession(initialSession);
        
        if (initialSession?.user && !isResetPasswordPage) {
          await fetchProfile(initialSession.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, 'Session:', !!session);
      
      if (!mounted) return;

      const isResetPasswordPage = location.pathname === '/reset-password';
      
      setSession(session);
      
      if (session?.user && !isResetPasswordPage) {
        // Fetch profile for new session
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id, false);
          }
        }, 0);
      } else {
        // Clear profile when signed out
        setProfile(null);
        setIsLoading(false);
      }
      
      // Handle redirect for password reset
      if (event === 'SIGNED_IN' && isResetPasswordPage) {
        console.log('User signed in for password reset - staying on reset page');
        return;
      }
      
      // Handle sign out
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setProfile(null);
        setIsLoading(false);
      }
    });

    // Initialize auth
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
