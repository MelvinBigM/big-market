
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFieldsProps {
  address: string;
  setAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
}

const AddressFields = ({
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
}: AddressFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
    </>
  );
};

export default AddressFields;
