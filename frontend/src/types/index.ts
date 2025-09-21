export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  isAgency: boolean;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}