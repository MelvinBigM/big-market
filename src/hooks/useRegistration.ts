
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
      // 1. Vérifier si le téléphone existe déjà dans les profils
      const { data: existingProfiles, error: profileCheckError } = await supabase
        .from('profiles')
        .select('phone_number, id')
        .eq('phone_number', phoneNumber);

      if (profileCheckError) {
        console.error('Erreur lors de la vérification des profils:', profileCheckError);
        const errorMsg = "Erreur lors de la vérification des données. Veuillez réessayer.";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      if (existingProfiles && existingProfiles.length > 0) {
        const errorMsg = "Ce numéro de téléphone est déjà utilisé par un autre compte. Veuillez utiliser un autre numéro.";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // 2. Tenter l'inscription
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

      // 3. Gérer les erreurs d'inscription
      if (signUpError) {
        console.error('Erreur d\'inscription:', signUpError);
        
        let errorMessage = "";
        
        if (signUpError.message.includes("User already registered") || 
            signUpError.message.includes("already exists") ||
            signUpError.message.includes("already been taken") ||
            signUpError.message.includes("Email address is already registered")) {
          errorMessage = "Cette adresse email est déjà utilisée par un autre compte. Veuillez vous connecter ou utiliser une autre adresse email.";
        } else if (signUpError.message.includes("For security purposes")) {
          errorMessage = "Trop de tentatives récentes. Veuillez patienter quelques instants avant de réessayer.";
        } else if (signUpError.message.includes("Password") || signUpError.message.includes("password")) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères avec une lettre minuscule, une majuscule et un chiffre.";
        } else if (signUpError.message.includes("Email") || signUpError.message.includes("email")) {
          errorMessage = "Veuillez saisir une adresse email valide.";
        } else if (signUpError.message.includes("rate limit")) {
          errorMessage = "Trop de tentatives d'inscription. Veuillez patienter quelques minutes avant de réessayer.";
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

      // 4. Vérifier le succès de l'inscription
      if (!authData || !authData.user) {
        const errorMsg = "Une erreur inattendue s'est produite lors de l'inscription.";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // 5. Vérifier si c'est un compte existant qui essaie de s'inscrire à nouveau
      const user = authData.user;
      
      // Si l'utilisateur a déjà un email confirmé, c'est un compte existant
      if (user.email_confirmed_at) {
        const errorMsg = "Cette adresse email est déjà utilisée par un compte confirmé. Veuillez vous connecter.";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // 6. Vérifier si un profil existe déjà pour cet utilisateur
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        const errorMsg = "Cette adresse email est déjà utilisée. Un email de confirmation a déjà été envoyé. Veuillez vérifier votre boîte de réception.";
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // 7. Inscription réussie !
      console.log('Nouvelle inscription réussie pour:', email);
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
