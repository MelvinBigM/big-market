
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "./register/RegistrationForm";
import RegistrationSuccessMessage from "./register/RegistrationSuccessMessage";

const RegisterPage = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  const handleRegistrationSuccess = (email: string) => {
    setRegisteredEmail(email);
    setShowSuccessMessage(true);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleRegisterAnother = () => {
    setShowSuccessMessage(false);
    setRegisteredEmail("");
  };

  if (showSuccessMessage) {
    return (
      <RegistrationSuccessMessage
        registeredEmail={registeredEmail}
        onGoToLogin={handleGoToLogin}
        onRegisterAnother={handleRegisterAnother}
      />
    );
  }

  return (
    <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
  );
};

export default RegisterPage;
