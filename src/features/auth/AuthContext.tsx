import { createContext, useContext, useEffect, useState } from "react";
import { login, logout, refreshSession, register } from "../../api/auth";
import { setAccessToken } from "../../api/client";
import type { AuthUser } from "../../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: { fullName: string; email: string; password: string }) => Promise<{ verificationUrl?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refresh()
      .catch(() => {
        setUser(null);
        setToken(null);
        setAccessToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(payload: { email: string; password: string }) {
    const response = await login(payload);
    setUser(response.user);
    setToken(response.accessToken);
    setAccessToken(response.accessToken);
  }

  async function signUp(payload: { fullName: string; email: string; password: string }) {
    return register(payload);
  }

  async function signOut() {
    await logout();
    setUser(null);
    setToken(null);
    setAccessToken(null);
  }

  async function refresh() {
    const response = await refreshSession();
    setUser(response.user);
    setToken(response.accessToken);
    setAccessToken(response.accessToken);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        signIn,
        signUp,
        signOut,
        refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
