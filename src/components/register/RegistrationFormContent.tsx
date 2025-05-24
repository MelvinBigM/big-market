
import { Button } from "@/components/ui/button";
import CompanyInfoFields from "./CompanyInfoFields";
import ManagerFields from "./ManagerFields";
import AddressFields from "./AddressFields";
import RegistrationErrorDisplay from "./RegistrationErrorDisplay";

interface RegistrationFormContentProps {
  formData: {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    companyName: string;
    setCompanyName: (value: string) => void;
    managerFirstName: string;
    setManagerFirstName: (value: string) => void;
    managerLastName: string;
    setManagerLastName: (value: string) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    address: string;
    setAddress: (value: string) => void;
    city: string;
    setCity: (value: string) => void;
    postalCode: string;
    setPostalCode: (value: string) => void;
  };
  isLoading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onGoToLogin: () => void;
}

const RegistrationFormContent = ({
  formData,
  isLoading,
  error,
  onSubmit,
  onGoToLogin,
}: RegistrationFormContentProps) => {
  return (
    <>
      <RegistrationErrorDisplay error={error} />

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <CompanyInfoFields
            companyName={formData.companyName}
            setCompanyName={formData.setCompanyName}
            email={formData.email}
            setEmail={formData.setEmail}
            phoneNumber={formData.phoneNumber}
            setPhoneNumber={formData.setPhoneNumber}
            password={formData.password}
            setPassword={formData.setPassword}
          />

          <ManagerFields
            managerFirstName={formData.managerFirstName}
            setManagerFirstName={formData.setManagerFirstName}
            managerLastName={formData.managerLastName}
            setManagerLastName={formData.setManagerLastName}
          />

          <AddressFields
            address={formData.address}
            setAddress={formData.setAddress}
            city={formData.city}
            setCity={formData.setCity}
            postalCode={formData.postalCode}
            setPostalCode={formData.setPostalCode}
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
              onClick={onGoToLogin}
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default RegistrationFormContent;
