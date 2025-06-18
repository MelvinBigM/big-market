
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      setIsCheckingSession(true);
      
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        
        console.log("URL params:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        if (accessToken && refreshToken && type === 'recovery') {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Error setting session:", error);
            toast.error("Lien de réinitialisation invalide ou expiré");
            navigate("/login");
            return;
          }

          console.log("Session set successfully for password reset");
          setIsValidSession(true);
        } else {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            toast.error("Erreur lors de la vérification de la session");
            navigate("/login");
            return;
          }

          if (session && session.user.aud === 'authenticated') {
            console.log("Valid recovery session found");
            setIsValidSession(true);
          } else {
            console.log("No valid recovery session found");
            toast.error("Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.");
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error during session setup:", error);
        toast.error("Erreur lors de la validation du lien");
        navigate("/login");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidSession) {
      toast.error("Session invalide. Veuillez demander un nouveau lien de réinitialisation.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Tentative de mise à jour du mot de passe...");
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      console.log("Réponse de updateUser:", { error });

      if (error) {
        console.error("Error updating password:", error);
        console.log("Error message:", error.message);
        console.log("Error code:", error.status);
        
        // Vérifier plusieurs variantes possibles de l'erreur du mot de passe identique
        const samePasswordPatterns = [
          'New password should be different from the old password',
          'same_password',
          'Password should be different',
          'identical password',
          'même mot de passe',
          'identique'
        ];
        
        const isSamePasswordError = samePasswordPatterns.some(pattern => 
          error.message.toLowerCase().includes(pattern.toLowerCase())
        );
        
        if (isSamePasswordError) {
          console.log("Erreur détectée : mot de passe identique");
          toast.error("⚠️ Nouveau mot de passe requis", {
            description: "Votre nouveau mot de passe doit être différent de l'ancien. Veuillez choisir un mot de passe différent.",
            duration: 6000,
          });
          return;
        }
        
        // Autres erreurs
        console.log("Autre type d'erreur:", error.message);
        toast.error(`Erreur lors de la mise à jour du mot de passe : ${error.message}`);
        return;
      }

      console.log("Mot de passe mis à jour avec succès");
      
      toast.success("🎉 Mot de passe modifié avec succès !", {
        description: "Vous allez être redirigé vers la page de connexion dans 3 secondes",
        duration: 3000,
      });
      
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/login", { 
          state: { 
            message: "Votre mot de passe a été modifié avec succès. Veuillez vous connecter avec votre nouveau mot de passe." 
          }
        });
      }, 3000);
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(`Erreur inattendue : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    isValidSession,
    isCheckingSession,
    handleResetPassword
  };
};
