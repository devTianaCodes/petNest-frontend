const LOCAL_API_URL = "http://localhost:4000/api";
const PRODUCTION_API_URL = "https://petnest-api-production.up.railway.app/api";

function resolveApiUrl() {
  const configuredApiUrl = import.meta.env.VITE_API_URL;
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  const isLocalApiUrl =
    configuredApiUrl?.includes("localhost") || configuredApiUrl?.includes("127.0.0.1");

  if (configuredApiUrl && (!isLocalApiUrl || isLocalHost)) {
    return configuredApiUrl;
  }

  return isLocalHost ? LOCAL_API_URL : PRODUCTION_API_URL;
}

const API_URL = resolveApiUrl();

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  formData?: FormData;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: HeadersInit = {};

  if (!options.formData && options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
