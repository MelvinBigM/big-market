
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRegistration = () => {
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
  const [error, setError] = useState("");

  const validateAndRegister = async (onSuccess: (email: string) => void) => {
    setIsLoading(true);
    setError("");

    console.log("Début de l'inscription pour:", email);

    try {
      // Vérifier d'abord si le téléphone existe déjà
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phoneNumber);

      if (checkError) {
        console.error('Erreur lors de la vérification des données existantes:', checkError);
        const errorMsg = "Erreur lors de la vérification des données. Veuillez réessayer.";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // Vérifier si le numéro de téléphone existe déjà
      if (existingProfiles && existingProfiles.length > 0) {
        const errorMsg = "Ce numéro de téléphone est déjà utilisé par un autre compte. Veuillez utiliser un autre numéro.";
        setError(errorMsg);
        toast.error(errorMsg);
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
        
        let errorMessage = "";
        
        // Gestion des erreurs spécifiques
        if (signUpError.message.includes("User already registered") || 
            signUpError.message.includes("already exists") ||
            signUpError.message.includes("already been taken") ||
            signUpError.message.includes("Email address is already registered")) {
          errorMessage = "Cette adresse email est déjà utilisée par un autre compte. Veuillez vous connecter ou utiliser une autre adresse email.";
        } else if (signUpError.name === "AuthWeakPasswordError" || 
                   signUpError.message.includes("Password should contain at least one character")) {
          errorMessage = "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule et un chiffre.";
        } else if (signUpError.message.includes("Password") || signUpError.message.includes("password")) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères avec une lettre minuscule, une majuscule et un chiffre.";
        } else if (signUpError.message.includes("Email") || signUpError.message.includes("email")) {
          errorMessage = "Veuillez saisir une adresse email valide.";
        } else if (signUpError.message.includes("rate limit")) {
          errorMessage = "Trop de tentatives d'inscription. Veuillez patienter quelques minutes avant de réessayer.";
        } else if (signUpError.message.includes("invalid phone")) {
          errorMessage = "Le numéro de téléphone saisi n'est pas valide.";
        } else if (signUpError.message.includes("signup_disabled")) {
          errorMessage = "Les inscriptions sont temporairement désactivées. Veuillez réessayer plus tard.";
        } else {
          errorMessage = `Erreur lors de l'inscription : ${signUpError.message}`;
        }

        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // Vérifier si l'utilisateur existe déjà (cas de repeated signup)
      if (authData && !authData.user?.email_confirmed_at && authData.user?.id) {
        // L'utilisateur existe déjà mais n'a pas confirmé son email
        const errorMsg = "Cette adresse email est déjà utilisée. Si c'est votre compte, veuillez vérifier votre email pour le confirmer ou vous connecter.";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // Inscription réussie
      console.log('Inscription réussie pour:', email);
      console.log('Données utilisateur:', authData);
      
      onSuccess(email);
      const successMsg = "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.";
      toast.success(successMsg);

    } catch (error: any) {
      console.error('Erreur complète d\'inscription:', error);
      const errorMsg = "Une erreur inattendue s'est produite. Veuillez réessayer.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Form state
    email, setEmail,
    password, setPassword,
    companyName, setCompanyName,
    managerFirstName, setManagerFirstName,
    managerLastName, setManagerLastName,
    phoneNumber, setPhoneNumber,
    address, setAddress,
    city, setCity,
    postalCode, setPostalCode,
    
    // Registration state
    isLoading,
    error,
    setError,
    
    // Actions
    validateAndRegister,
  };
};
