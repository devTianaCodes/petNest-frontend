import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { demoLogin, login, logout, refreshSession, register } from "../../api/auth";
import { setAccessToken } from "../../api/client";
import type { AuthUser } from "../../types/auth";
import { createAuthSession } from "./authSession";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signInDemo: () => Promise<void>;
  signUp: (payload: { fullName: string; email: string; password: string }) => Promise<{ verificationUrl?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session] = useState(() => {
    let userId: string | undefined;
    return createAuthSession({
      login,
      demoLogin,
      refreshSession,
      logout,
      onChange: (response) => {
        const nextUserId = response?.user.id;
        if (userId !== nextUserId) queryClient.clear();
        userId = nextUserId;
        setAccessToken(response?.accessToken ?? null);
        setUser(response?.user ?? null);
        setToken(response?.accessToken ?? null);
      }
    });
  });

  useEffect(() => {
    let active = true;
    session.refresh()
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [session]);

  async function signUp(payload: { fullName: string; email: string; password: string }) {
    return register(payload);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        signIn: session.signIn,
        signInDemo: session.signInDemo,
        signUp,
        signOut: session.signOut,
        refresh: session.refresh
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
