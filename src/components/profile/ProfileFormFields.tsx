
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProfileFormFieldsProps {
  formData: Partial<Profile>;
  onInputChange: (field: keyof Profile, value: string | boolean) => void;
  errors?: Record<string, string>;
}

const ProfileFormFields = ({ formData, onInputChange, errors = {} }: ProfileFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="manager_first_name">
            Prénom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="manager_first_name"
            type="text"
            value={formData.manager_first_name || ""}
            onChange={(e) => onInputChange("manager_first_name", e.target.value)}
            placeholder="Votre prénom"
            className={cn(
              "mt-1",
              errors.manager_first_name && "border-red-500 focus:border-red-500"
            )}
            required
          />
          {errors.manager_first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.manager_first_name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="manager_last_name">
            Nom <span className="text-red-500">*</span>
          </Label>
          <Input
            id="manager_last_name"
            type="text"
            value={formData.manager_last_name || ""}
            onChange={(e) => onInputChange("manager_last_name", e.target.value)}
            placeholder="Votre nom"
            className={cn(
              "mt-1",
              errors.manager_last_name && "border-red-500 focus:border-red-500"
            )}
            required
          />
          {errors.manager_last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.manager_last_name}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="company_name">
          Nom de l'entreprise <span className="text-red-500">*</span>
        </Label>
        <Input
          id="company_name"
          type="text"
          value={formData.company_name || ""}
          onChange={(e) => onInputChange("company_name", e.target.value)}
          placeholder="Nom de votre entreprise"
          className={cn(
            "mt-1",
            errors.company_name && "border-red-500 focus:border-red-500"
          )}
          required
        />
        {errors.company_name && (
          <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone_number">
          Téléphone <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone_number"
          type="tel"
          value={formData.phone_number || ""}
          onChange={(e) => onInputChange("phone_number", e.target.value)}
          placeholder="Ex: 0612345678 ou +33612345678"
          className={cn(
            "mt-1",
            errors.phone_number && "border-red-500 focus:border-red-500"
          )}
          required
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">
          Adresse <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          type="text"
          value={formData.address || ""}
          onChange={(e) => onInputChange("address", e.target.value)}
          placeholder="Votre adresse complète"
          className={cn(
            "mt-1",
            errors.address && "border-red-500 focus:border-red-500"
          )}
          required
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">
            Ville <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            value={formData.city || ""}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="Votre ville"
            className={cn(
              "mt-1",
              errors.city && "border-red-500 focus:border-red-500"
            )}
            required
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="postal_code">
            Code postal <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postal_code"
            type="text"
            value={formData.postal_code || ""}
            onChange={(e) => onInputChange("postal_code", e.target.value)}
            placeholder="Ex: 75001"
            maxLength={5}
            className={cn(
              "mt-1",
              errors.postal_code && "border-red-500 focus:border-red-500"
            )}
            required
          />
          {errors.postal_code && (
            <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
        <p className="text-blue-800 text-sm">
          <span className="text-red-500">*</span> Tous les champs sont obligatoires et doivent respecter le format requis.
        </p>
      </div>
    </>
  );
};

export default ProfileFormFields;
