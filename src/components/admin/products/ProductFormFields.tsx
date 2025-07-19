
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VatRateSelector from "./VatRateSelector";
import ProductImageUploader from "./ProductImageUploader";
import ProductImageManagerV2 from "./ProductImageManagerV2";
import { Category } from "@/lib/types";

interface ProductFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  vatRate: string;
  setVatRate: (value: string) => void;
  categories?: Category[];
  productId?: string;
}

const ProductFormFields = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  categoryId,
  setCategoryId,
  imageUrl,
  setImageUrl,
  vatRate,
  setVatRate,
  categories,
  productId,
}: ProductFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du produit"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du produit"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="price">Prix HT</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Prix du produit"
          required
        />
      </div>
      
      <VatRateSelector value={vatRate} onChange={setVatRate} />
      
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <ProductImageUploader
        value={imageUrl}
        onChange={setImageUrl}
        label="Image principale"
        placeholder="Aucune image principale sélectionnée"
      />

      {/* Product Image Manager for additional images */}
      <ProductImageManagerV2 productId={productId} />
    </div>
  );
};

export default ProductFormFields;
