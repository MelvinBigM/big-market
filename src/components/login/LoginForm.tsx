
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  emailError: string;
  passwordError: string;
  loginFormSubmitted: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({
  email,
  password,
  isLoading,
  emailError,
  passwordError,
  loginFormSubmitted,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Votre email"
            value={email}
            onChange={onEmailChange}
            className={emailError ? "border-red-500" : ""}
          />
          {emailError && loginFormSubmitted && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Votre mot de passe"
            value={password}
            onChange={onPasswordChange}
            className={passwordError ? "border-red-500" : ""}
          />
          {passwordError && loginFormSubmitted && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
};

export default LoginForm;
