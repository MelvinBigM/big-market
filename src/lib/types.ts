export type Profile = {
  id: string;
  role: 'admin' | 'client' | 'nouveau';
  company_name: string | null;
  manager_first_name: string | null;
  manager_last_name: string | null;
  created_at: string;
  updated_at: string;
  is_company: boolean | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  email: string | null;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  in_stock: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  vat_rate: number; // Taux de TVA: 5.5, 10, or 20
};

export type AccessRequest = {
  id: string;
  user_id: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type Banner = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  bgColor: string;
  text_color: string;
  position: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};
