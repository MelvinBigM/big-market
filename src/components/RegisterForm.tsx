
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface RegisterFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    companyName: string;
    managerFirstName: string;
    managerLastName: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
  }) => void;
  isLoading: boolean;
}

const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    managerFirstName: "",
    managerLastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-4">
        <div>
          <Label htmlFor="companyName">Nom de la société</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            required
            placeholder="Nom de votre société"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            placeholder="Email de votre société"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="managerFirstName">Prénom du responsable</Label>
            <Input
              id="managerFirstName"
              value={formData.managerFirstName}
              onChange={(e) => handleChange('managerFirstName', e.target.value)}
              required
              placeholder="Prénom"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="managerLastName">Nom du responsable</Label>
            <Input
              id="managerLastName"
              value={formData.managerLastName}
              onChange={(e) => handleChange('managerLastName', e.target.value)}
              required
              placeholder="Nom"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
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
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            required
            placeholder="Téléphone de votre société"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
            placeholder="Adresse de votre société"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              required
              placeholder="Code postal"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
              placeholder="Ville"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Inscription..." : "S'inscrire"}
      </Button>
    </form>
  );
};

export default RegisterForm;
