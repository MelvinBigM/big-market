
export type UserProfileData = {
  id: string;
  role: 'admin' | 'client' | 'nouveau';
  full_name: string | null;
  created_at: string;
  updated_at: string;
  is_company: boolean | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
};
