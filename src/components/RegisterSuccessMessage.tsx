
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Mail } from "lucide-react";

interface RegisterSuccessMessageProps {
  email: string;
  onGoToLogin: () => void;
  onRegisterAnother: () => void;
}

const RegisterSuccessMessage = ({ email, onGoToLogin, onRegisterAnother }: RegisterSuccessMessageProps) => {
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
            Un email de confirmation a été envoyé à <strong>{email}</strong>.
            <br /><br />
            Veuillez vérifier votre boîte de réception (et vos spams) et cliquer sur le lien de confirmation pour activer votre compte.
            <br /><br />
            Une fois votre email confirmé, vous pourrez vous connecter et faire votre demande d'accès client depuis votre tableau de bord.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-4">
          <Button
            onClick={onGoToLogin}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Aller à la page de connexion
          </Button>
          <Button
            variant="outline"
            onClick={onRegisterAnother}
            className="w-full"
          >
            Inscrire une autre société
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessMessage;
