
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";
import { Mail } from "lucide-react";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccessMessage(false);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            manager_first_name: managerFirstName,
            manager_last_name: managerLastName,
            phone_number: phoneNumber,
            is_company: true,
            address,
            city,
            postal_code: postalCode,
          },
        },
      });

      if (signUpError) {
        // Gestion des erreurs spécifiques
        if (signUpError.message.includes("User already registered")) {
          toast.error("Un compte existe déjà avec cette adresse email. Veuillez vous connecter ou utiliser une autre adresse email.");
        } else if (signUpError.message.includes("Password")) {
          toast.error("Le mot de passe doit contenir au moins 6 caractères.");
        } else if (signUpError.message.includes("Email")) {
          toast.error("Veuillez saisir une adresse email valide.");
        } else {
          toast.error(`Erreur lors de l'inscription : ${signUpError.message}`);
        }
        throw signUpError;
      }

      // Inscription réussie
      setRegisteredEmail(email);
      setShowSuccessMessage(true);
      toast.success("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
      
      console.log('Inscription réussie pour:', email);
      console.log('Données utilisateur:', authData);

    } catch (error: any) {
      console.error('Erreur complète d\'inscription:', error);
      // Les erreurs spécifiques sont déjà gérées ci-dessus
    } finally {
      setIsLoading(false);
    }
  };

  // Si l'inscription a réussi, afficher le message de confirmation
  if (showSuccessMessage) {
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
              Inscription réussie !
            </h2>
          </div>

          <Alert className="border-green-200 bg-green-50">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Votre inscription a été prise en compte avec succès !</strong>
              <br /><br />
              Un email de confirmation a été envoyé à <strong>{registeredEmail}</strong>.
              <br /><br />
              Veuillez vérifier votre boîte de réception (et vos spams) et cliquer sur le lien de confirmation pour activer votre compte.
              <br /><br />
              Une fois votre email confirmé, vous pourrez vous connecter et faire votre demande d'accès client depuis votre tableau de bord.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Aller à la page de connexion
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessMessage(false);
                // Réinitialiser le formulaire
                setEmail("");
                setPassword("");
                setCompanyName("");
                setManagerFirstName("");
                setManagerLastName("");
                setPhoneNumber("");
                setAddress("");
                setCity("");
                setPostalCode("");
              }}
              className="w-full"
            >
              Inscrire une autre société
            </Button>
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
            Créer un compte entreprise Big Market
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inscription réservée aux entreprises
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="companyName">Nom de la société</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Nom de votre société"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email de votre société"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managerFirstName">Prénom du responsable</Label>
                <Input
                  id="managerFirstName"
                  value={managerFirstName}
                  onChange={(e) => setManagerFirstName(e.target.value)}
                  required
                  placeholder="Prénom"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="managerLastName">Nom du responsable</Label>
                <Input
                  id="managerLastName"
                  value={managerLastName}
                  onChange={(e) => setManagerLastName(e.target.value)}
                  required
                  placeholder="Nom"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Votre mot de passe"
                minLength={6}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Téléphone de votre société"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Adresse de votre société"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="Code postal"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Ville"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
            <p className="text-center text-sm">
              Déjà inscrit ?{" "}
              <button
                type="button"
                className="text-primary hover:text-primary/90"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
