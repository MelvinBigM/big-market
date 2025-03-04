
export type Banner = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  bgColor: string;
  text_color: string;
  position: number;
  created_at: string;
  updated_at: string;
};

// Temporary default banners - later these will be loaded from Supabase
export const banners = [
  {
    id: "1",
    title: "Bienvenue chez BIG IMEX",
    description: "Votre destination pour des produits alimentaires et des boissons de qualité. Découvrez notre large sélection de produits soigneusement sélectionnés.",
    image_url: null,
    bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
    text_color: "text-white",
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Découvrez nos Produits",
    description: "Une sélection premium de produits soigneusement choisis pour vous. Nous nous engageons à vous offrir uniquement le meilleur.",
    image_url: null,
    bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
    text_color: "text-black",
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Qualité Garantie",
    description: "Nous nous engageons à vous offrir les meilleurs produits du marché. La qualité est au cœur de nos préoccupations.",
    image_url: null,
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
    text_color: "text-white",
    position: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
