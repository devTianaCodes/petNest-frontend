export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  fullName?: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};
