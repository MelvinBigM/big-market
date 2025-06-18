
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { validateEmail, validatePassword, sanitizeInput } from "@/lib/validation";
import { checkLoginRateLimit, getLoginRateLimitRemainingTime } from "@/lib/rateLimiting";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Clear previous errors
    setEmailError("");
    setPasswordError("");
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || "");
      isValid = false;
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || "");
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check rate limiting
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    if (!checkLoginRateLimit(sanitizedEmail)) {
      const remainingTime = getLoginRateLimitRemainingTime(sanitizedEmail);
      const minutes = Math.ceil(remainingTime / (60 * 1000));
      toast.error("🚫 Trop de tentatives de connexion", {
        description: `Veuillez attendre ${minutes} minute(s) avant de réessayer`,
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success("Connexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Gestion spécifique des erreurs de connexion
      if (error.message === "Invalid login credentials") {
        toast.error("❌ Identifiants incorrects", {
          description: "Vérifiez votre adresse email et votre mot de passe",
          duration: 4000,
        });
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("📧 Email non confirmé", {
          description: "Veuillez vérifier votre boîte mail et confirmer votre compte",
          duration: 5000,
        });
      } else if (error.message.includes("Invalid email")) {
        toast.error("📧 Adresse email invalide", {
          description: "Veuillez saisir une adresse email valide",
          duration: 4000,
        });
      } else {
        toast.error("🚫 Erreur de connexion", {
          description: error.message || "Une erreur inattendue est survenue",
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Connexion à Big Market
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Votre email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            
            <div className="text-center space-y-2">
              <ForgotPasswordDialog />
              <p className="text-sm">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  className="text-primary hover:text-primary/90"
                  onClick={() => navigate("/register")}
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
