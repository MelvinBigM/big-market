
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  const checkEmailExists = async (email: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .single();
    return !!data;
  };

  const checkPhoneExists = async (phone: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("phone_number")
      .eq("phone_number", phone)
      .single();
    return !!data;
  };

  const handleRegister = async (formData: {
    email: string;
    password: string;
    companyName: string;
    managerFirstName: string;
    managerLastName: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
  }) => {
    setIsLoading(true);
    setShowSuccessMessage(false);

    try {
      // Vérifier si l'email existe déjà dans notre table profiles
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        toast.error("Un compte existe déjà avec cette adresse email.");
        return;
      }

      // Vérifier si le numéro de téléphone existe déjà
      const phoneExists = await checkPhoneExists(formData.phoneNumber);
      if (phoneExists) {
        toast.error("Un compte existe déjà avec ce numéro de téléphone.");
        return;
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            company_name: formData.companyName,
            manager_first_name: formData.managerFirstName,
            manager_last_name: formData.managerLastName,
            phone_number: formData.phoneNumber,
            is_company: true,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("Password")) {
          toast.error("Le mot de passe doit contenir au moins 6 caractères.");
        } else if (signUpError.message.includes("Email")) {
          toast.error("Veuillez saisir une adresse email valide.");
        } else {
          toast.error(`Erreur lors de l'inscription : ${signUpError.message}`);
        }
        throw signUpError;
      }

      setRegisteredEmail(formData.email);
      setShowSuccessMessage(true);
      toast.success("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
      
      console.log('Inscription réussie pour:', formData.email);
      console.log('Données utilisateur:', authData);

    } catch (error: any) {
      console.error('Erreur complète d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowSuccessMessage(false);
    setRegisteredEmail("");
  };

  return {
    isLoading,
    showSuccessMessage,
    registeredEmail,
    handleRegister,
    resetForm,
    navigate
  };
};
