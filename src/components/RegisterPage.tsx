
import { useNavigate } from "react-router-dom";
import { useRegistration } from "@/hooks/useRegistration";
import RegisterForm from "./RegisterForm";
import RegisterSuccessMessage from "./RegisterSuccessMessage";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    showSuccessMessage, 
    registeredEmail, 
    handleRegister, 
    resetForm 
  } = useRegistration();

  if (showSuccessMessage) {
    return (
      <RegisterSuccessMessage
        email={registeredEmail}
        onGoToLogin={() => navigate("/login")}
        onRegisterAnother={resetForm}
      />
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

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

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
    </div>
  );
};

export default RegisterPage;
