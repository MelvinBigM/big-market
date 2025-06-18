
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      setIsCheckingSession(true);
      
      try {
        // Vérifier d'abord s'il y a des paramètres d'URL valides
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        
        console.log("URL params:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        if (accessToken && refreshToken && type === 'recovery') {
          // Définir la session avec les tokens de l'URL SANS redirection automatique
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
          
          // IMPORTANT: Ne pas rediriger automatiquement, rester sur cette page
          // pour permettre à l'utilisateur de changer son mot de passe
        } else {
          // Vérifier s'il y a déjà une session valide de type recovery
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            toast.error("Erreur lors de la vérification de la session");
            navigate("/login");
            return;
          }

          // Vérifier si c'est une session de récupération de mot de passe
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
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }

      // Marquer le mot de passe comme mis à jour
      setPasswordUpdated(true);
      
      // Notification de succès plus visible
      toast.success("🎉 Mot de passe modifié avec succès !", {
        description: "Vous allez être redirigé vers la page de connexion dans 5 secondes",
        duration: 5000,
      });
      
      // Attendre 5 secondes avant de déconnecter et rediriger
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/login", { 
          state: { 
            message: "Votre mot de passe a été modifié avec succès. Veuillez vous connecter avec votre nouveau mot de passe." 
          }
        });
      }, 5000);
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(`Erreur lors de la mise à jour du mot de passe : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center">
            <img
              src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png"
              alt="Big Market Logo"
              className="h-24 w-24 mb-4"
            />
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Vérification en cours...
            </h2>
            <p className="mt-2 text-gray-600">
              Validation de votre lien de réinitialisation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center">
            <img
              src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png"
              alt="Big Market Logo"
              className="h-24 w-24 mb-4"
            />
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Lien invalide
            </h2>
            <p className="mt-2 text-gray-600">
              Ce lien de réinitialisation n'est plus valide.
            </p>
            <Button 
              onClick={() => navigate("/login")} 
              className="mt-4"
            >
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Afficher un message de succès si le mot de passe a été mis à jour
  if (passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center">
            <img
              src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png"
              alt="Big Market Logo"
              className="h-24 w-24 mb-4"
            />
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Mot de passe modifié !
            </h2>
            <p className="mt-2 text-gray-600">
              Votre mot de passe a été mis à jour avec succès.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Redirection en cours vers la page de connexion...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png"
            alt="Big Market Logo"
            className="h-24 w-24 mb-4"
          />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Nouveau mot de passe
          </h2>
          <p className="mt-2 text-gray-600">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Retapez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading || !password || !confirmPassword}
          >
            {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
