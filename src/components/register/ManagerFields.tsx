
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ManagerFieldsProps {
  managerFirstName: string;
  setManagerFirstName: (value: string) => void;
  managerLastName: string;
  setManagerLastName: (value: string) => void;
}

const ManagerFields = ({
  managerFirstName,
  setManagerFirstName,
  managerLastName,
  setManagerLastName,
}: ManagerFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="managerFirstName">Prénom du responsable</Label>
        <Input
          id="managerFirstName"
          value={managerFirstName}
          onChange={(e) => setManagerFirstName(e.target.value)}
          required
          placeholder="Prénom"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="managerLastName">Nom du responsable</Label>
        <Input
          id="managerLastName"
          value={managerLastName}
          onChange={(e) => setManagerLastName(e.target.value)}
          required
          placeholder="Nom"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ManagerFields;
