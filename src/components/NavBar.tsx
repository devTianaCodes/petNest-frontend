import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const sharedLinkClass =
  "rounded-full px-4 py-2 text-sm font-medium transition hover:bg-fern/10 hover:text-fern";

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-ink">
          PetNest
        </Link>
        <nav className="flex items-center gap-2 text-ink">
          <NavLink to="/browse" className={sharedLinkClass}>
            Browse
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={sharedLinkClass}>
                Dashboard
              </NavLink>
              {user.role === "ADMIN" ? (
                <NavLink to="/admin" className={sharedLinkClass}>
                  Admin
                </NavLink>
              ) : null}
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={sharedLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className="rounded-full bg-fern px-4 py-2 text-sm font-medium text-white">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
