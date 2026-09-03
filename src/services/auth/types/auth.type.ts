export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  business_email: string;
  role_id: string;
  business_id: string;
  store_id: string | null;
  is_active: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
