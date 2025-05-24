
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInfoFieldsProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

const CompanyInfoFields = ({
  companyName,
  setCompanyName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
}: CompanyInfoFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="companyName">Nom de la société</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email de votre société"
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
          placeholder="Téléphone de votre société"
          className="mt-1"
        />
      </div>
    </>
  );
};

export default CompanyInfoFields;
