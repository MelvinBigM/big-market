
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // 2. Mettre à jour le profil utilisateur dans profiles
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: isCompany ? null : fullName,
            phone_number: phoneNumber,
            is_company: isCompany,
            company_name: isCompany ? companyName : null,
            address,
            city,
            postal_code: postalCode,
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour du profil:', updateError);
          throw updateError;
        }
      }

      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.message === "User already registered"
          ? "Un compte existe déjà avec cet email"
          : "Erreur lors de l'inscription"
      );
      console.error('Erreur complète:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/971215a2-f74e-4bb2-aa1a-cd630b4c8bb1.png"
            alt="Big Market Logo"
            className="h-24 w-24 mb-4"
          />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Créer un compte Big Market
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez-nous pour accéder à nos produits
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isCompany">Êtes-vous une société ?</Label>
              <Switch
                id="isCompany"
                checked={isCompany}
                onCheckedChange={setIsCompany}
              />
            </div>

            {isCompany ? (
              <div>
                <Label htmlFor="companyName">Nom de la société</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required={isCompany}
                  placeholder="Nom de votre société"
                  className="mt-1"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isCompany}
                  placeholder="Votre nom complet"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Votre email"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Votre mot de passe"
                minLength={6}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Votre numéro de téléphone"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Votre adresse"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="Code postal"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Ville"
                  className="mt-1"
                />
              </div>
            </div>
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

export default RegisterPage;
