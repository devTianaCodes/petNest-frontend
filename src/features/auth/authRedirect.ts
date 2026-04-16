const blockedRedirects = new Set(["/login", "/register"]);

export function getProtectedRedirect(pathname: string, search = "") {
  return `/login?redirect=${encodeURIComponent(`${pathname}${search}`)}`;
}

export function getPostLoginRedirect(redirect: string | null | undefined, fallback = "/dashboard") {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return fallback;
  }

  const [pathname] = redirect.split("?");
  if (blockedRedirects.has(pathname)) {
    return fallback;
  }

  return redirect;
}
