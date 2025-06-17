
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Profile } from "@/lib/types";

interface ProfileFormFieldsProps {
  formData: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: string | boolean) => void;
}

const ProfileFormFields = ({ formData, onInputChange }: ProfileFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="manager_first_name">Prénom</Label>
          <Input
            id="manager_first_name"
            type="text"
            value={formData.manager_first_name || ""}
            onChange={(e) => onInputChange("manager_first_name", e.target.value)}
            placeholder="Votre prénom"
          />
        </div>
        <div>
          <Label htmlFor="manager_last_name">Nom</Label>
          <Input
            id="manager_last_name"
            type="text"
            value={formData.manager_last_name || ""}
            onChange={(e) => onInputChange("manager_last_name", e.target.value)}
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="company_name">Nom de l'entreprise</Label>
        <Input
          id="company_name"
          type="text"
          value={formData.company_name || ""}
          onChange={(e) => onInputChange("company_name", e.target.value)}
          placeholder="Nom de votre entreprise"
        />
      </div>

      <div>
        <Label htmlFor="phone_number">Téléphone</Label>
        <Input
          id="phone_number"
          type="tel"
          value={formData.phone_number || ""}
          onChange={(e) => onInputChange("phone_number", e.target.value)}
          placeholder="Votre numéro de téléphone"
        />
      </div>

      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          type="text"
          value={formData.address || ""}
          onChange={(e) => onInputChange("address", e.target.value)}
          placeholder="Votre adresse"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            type="text"
            value={formData.city || ""}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="Votre ville"
          />
        </div>
        <div>
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            type="text"
            value={formData.postal_code || ""}
            onChange={(e) => onInputChange("postal_code", e.target.value)}
            placeholder="Code postal"
          />
        </div>
      </div>
    </>
  );
};

export default ProfileFormFields;
