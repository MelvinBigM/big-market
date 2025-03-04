
export type Profile = {
  id: string;
  role: 'admin' | 'client' | 'nouveau';
  full_name: string | null;
  created_at: string;
  updated_at: string;
  is_company: boolean | null;
  company_name: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
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
  created_at: string;
  updated_at: string;
};
