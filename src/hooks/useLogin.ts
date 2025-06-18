
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateEmail, validatePassword, sanitizeInput } from "@/lib/validation";
import { checkLoginRateLimit, getLoginRateLimitRemainingTime } from "@/lib/rateLimiting";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginFormSubmitted, setLoginFormSubmitted] = useState(false);
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
    setLoginFormSubmitted(true);
    
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Only clear error if login form has been submitted
    if (loginFormSubmitted && emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Only clear error if login form has been submitted
    if (loginFormSubmitted && passwordError) {
      setPasswordError("");
    }
  };

  return {
    email,
    password,
    isLoading,
    emailError,
    passwordError,
    loginFormSubmitted,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
  };
};
