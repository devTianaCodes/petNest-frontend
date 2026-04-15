import type { AuthResponse, AuthUser } from "../types/auth";
import { apiRequest } from "./client";

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export function register(payload: RegisterPayload) {
  return apiRequest<{
    message: string;
    user: AuthUser;
    verificationUrl?: string;
  }>("/auth/register", {
    method: "POST",
    body: payload
  });
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload
  });
}

export function refreshSession() {
  return apiRequest<AuthResponse>("/auth/refresh", {
    method: "POST"
  });
}

export function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST"
  });
}

export function fetchCurrentUser() {
  return apiRequest<{ user: AuthUser }>("/auth/me");
}

export function verifyEmail(token: string) {
  return apiRequest<{ message: string }>("/auth/verify-email", {
    method: "POST",
    body: { token }
  });
}
