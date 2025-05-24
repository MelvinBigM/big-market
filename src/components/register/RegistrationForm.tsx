
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CompanyInfoFields from "./CompanyInfoFields";
import ManagerFields from "./ManagerFields";
import AddressFields from "./AddressFields";

interface RegistrationFormProps {
  onRegistrationSuccess: (email: string) => void;
}

const RegistrationForm = ({ onRegistrationSuccess }: RegistrationFormProps) => {
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
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Vérifier d'abord si le téléphone existe déjà
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phoneNumber);

      if (checkError) {
        console.error('Erreur lors de la vérification des données existantes:', checkError);
        toast.error("Erreur lors de la vérification des données. Veuillez réessayer.");
        setIsLoading(false);
        return;
      }

      // Vérifier si le numéro de téléphone existe déjà
      if (existingProfiles && existingProfiles.length > 0) {
        toast.error("Ce numéro de téléphone est déjà utilisé par un autre compte. Veuillez utiliser un autre numéro ou vous connecter si c'est votre compte.");
        setIsLoading(false);
        return;
      }

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
        console.error('Erreur d\'inscription:', signUpError);
        
        // Gestion des erreurs spécifiques
        if (signUpError.message.includes("User already registered") || 
            signUpError.message.includes("already exists") ||
            signUpError.message.includes("already been taken")) {
          toast.error("Un compte existe déjà avec cette adresse email. Veuillez vous connecter ou utiliser une autre adresse email.");
        } else if (signUpError.message.includes("Password") || signUpError.message.includes("password")) {
          toast.error("Le mot de passe doit contenir au moins 6 caractères.");
        } else if (signUpError.message.includes("Email") || signUpError.message.includes("email")) {
          toast.error("Veuillez saisir une adresse email valide.");
        } else if (signUpError.message.includes("rate limit")) {
          toast.error("Trop de tentatives d'inscription. Veuillez patienter quelques minutes avant de réessayer.");
        } else {
          toast.error(`Erreur lors de l'inscription : ${signUpError.message}`);
        }
        setIsLoading(false);
        return;
      }

      // Inscription réussie
      onRegistrationSuccess(email);
      toast.success("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
      
      console.log('Inscription réussie pour:', email);
      console.log('Données utilisateur:', authData);

    } catch (error: any) {
      console.error('Erreur complète d\'inscription:', error);
      toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
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
            Créer un compte entreprise Big Market
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inscription réservée aux entreprises
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <CompanyInfoFields
              companyName={companyName}
              setCompanyName={setCompanyName}
              email={email}
              setEmail={setEmail}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              password={password}
              setPassword={setPassword}
            />

            <ManagerFields
              managerFirstName={managerFirstName}
              setManagerFirstName={setManagerFirstName}
              managerLastName={managerLastName}
              setManagerLastName={setManagerLastName}
            />

            <AddressFields
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
            />
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

export default RegistrationForm;
