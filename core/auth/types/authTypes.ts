export type refreshAccessTokenType = () => Promise<boolean>;

// =======================
// User
// =======================

export interface UserProps {
  id: number;
  created_at: string;
  email: string;
  email_verified_at?: string;
  is_admin: boolean;
  name: string;
  updated_at: string;
}
