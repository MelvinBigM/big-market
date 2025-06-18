
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const ForgotPasswordDialog = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Veuillez saisir une adresse email valide");
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
      toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte mail.");
      setEmailSent(true);
    } catch (error: any) {
      console.error("Error in password reset:", error);
      
      let errorMessage = "Erreur lors de l'envoi de l'email de réinitialisation";
      
      if (error.message.includes("Invalid email")) {
        errorMessage = "Adresse email invalide";
      } else if (error.message.includes("Email not found")) {
        errorMessage = "Aucun compte trouvé avec cette adresse email";
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
    setEmailSent(false);
    setEmail("");
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
        
        {!emailSent ? (
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
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nous enverrons un lien de réinitialisation à cette adresse
              </p>
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
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Email envoyé !
              </h3>
              <p className="text-sm text-gray-600">
                Nous avons envoyé un lien de réinitialisation à :
              </p>
              <p className="text-sm font-medium text-gray-900 break-words">
                {email}
              </p>
              <p className="text-sm text-gray-600">
                Vérifiez votre boîte mail (et le dossier spam) puis cliquez sur le lien pour créer un nouveau mot de passe.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Le lien expire dans 1 heure
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
