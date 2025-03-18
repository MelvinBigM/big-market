
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VatRateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const VatRateSelector = ({ value, onChange }: VatRateSelectorProps) => {
  return (
    <div className="grid gap-2">
      <Label>Taux de TVA</Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="5.5" id="tva-5.5" />
          <Label htmlFor="tva-5.5">5,5%</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="10" id="tva-10" />
          <Label htmlFor="tva-10">10%</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="20" id="tva-20" />
          <Label htmlFor="tva-20">20%</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default VatRateSelector;
