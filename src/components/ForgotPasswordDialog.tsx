
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";

const ForgotPasswordDialog = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError("Veuillez saisir votre adresse email");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Veuillez saisir une adresse email valide");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        throw error;
      }

      console.log("Reset email sent successfully");
      toast.success("Si un compte avec cette adresse email existe, un email de réinitialisation a été envoyé.", {
        description: "Vérifiez votre boîte mail (et le dossier spam).",
        duration: 5000,
      });
      
      // Fermer la modal et réinitialiser le formulaire
      setIsOpen(false);
      setEmail("");
      setEmailError("");
    } catch (error: any) {
      console.error("Error in password reset:", error);
      
      let errorMessage = "Erreur lors de l'envoi de l'email de réinitialisation";
      
      if (error.message.includes("Invalid email")) {
        errorMessage = "Adresse email invalide";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Trop de tentatives. Veuillez attendre avant de réessayer";
      } else if (error.message) {
        errorMessage += ` : ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmail("");
    setEmailError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-primary hover:text-primary/90 underline">
          Mot de passe oublié ?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label>
            <Input
              id="reset-email"
              type="email"
              required
              placeholder="Votre email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
