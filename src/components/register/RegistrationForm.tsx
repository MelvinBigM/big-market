
import { useNavigate } from "react-router-dom";
import { useRegistration } from "@/hooks/useRegistration";
import RegistrationFormHeader from "./RegistrationFormHeader";
import RegistrationFormContent from "./RegistrationFormContent";

interface RegistrationFormProps {
  onRegistrationSuccess: (email: string) => void;
}

const RegistrationForm = ({ onRegistrationSuccess }: RegistrationFormProps) => {
  const navigate = useNavigate();
  const registration = useRegistration();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registration.validateAndRegister(onRegistrationSuccess);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const formData = {
    email: registration.email,
    setEmail: registration.setEmail,
    password: registration.password,
    setPassword: registration.setPassword,
    companyName: registration.companyName,
    setCompanyName: registration.setCompanyName,
    managerFirstName: registration.managerFirstName,
    setManagerFirstName: registration.setManagerFirstName,
    managerLastName: registration.managerLastName,
    setManagerLastName: registration.setManagerLastName,
    phoneNumber: registration.phoneNumber,
    setPhoneNumber: registration.setPhoneNumber,
    address: registration.address,
    setAddress: registration.setAddress,
    city: registration.city,
    setCity: registration.setCity,
    postalCode: registration.postalCode,
    setPostalCode: registration.setPostalCode,
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <RegistrationFormHeader />
        
        <RegistrationFormContent
          formData={formData}
          isLoading={registration.isLoading}
          error={registration.error}
          onSubmit={handleRegister}
          onGoToLogin={handleGoToLogin}
        />
      </div>
    </div>
  );
};

export default RegistrationForm;
