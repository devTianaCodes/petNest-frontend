import type { AuthResponse } from "../../types/auth";

type SessionDependencies = {
  login: (payload: { email: string; password: string }) => Promise<AuthResponse>;
  demoLogin: () => Promise<AuthResponse>;
  refreshSession: () => Promise<AuthResponse>;
  logout: () => Promise<void>;
  onChange: (session: AuthResponse | null) => void;
};

export function createAuthSession(deps: SessionDependencies) {
  let version = 0;
  let pendingRefresh: Promise<void> | undefined;

  async function signIn(load: () => Promise<AuthResponse>) {
    const requestVersion = ++version;
    pendingRefresh = undefined;
    const session = await load();
    if (version === requestVersion) deps.onChange(session);
  }

  return {
    signIn: (payload: { email: string; password: string }) => signIn(() => deps.login(payload)),
    signInDemo: () => signIn(deps.demoLogin),
    async signOut() {
      version += 1;
      pendingRefresh = undefined;
      deps.onChange(null);
      await deps.logout();
    },
    refresh() {
      if (pendingRefresh) return pendingRefresh;
      const requestVersion = version;
      const request = deps.refreshSession()
        .then((session) => {
          if (version === requestVersion) deps.onChange(session);
        })
        .catch((error: unknown) => {
          if (version === requestVersion) deps.onChange(null);
          throw error;
        })
        .finally(() => {
          if (pendingRefresh === request) pendingRefresh = undefined;
        });
      pendingRefresh = request;
      return request;
    }
  };
}
