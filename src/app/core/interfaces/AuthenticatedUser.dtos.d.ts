declare interface AuthenticatedUser {
  name: string;
  avatar_url: string;
  email: string;
  isAuthenticated: boolean;
  signature?: 'active' | 'canceled' | null;
}
