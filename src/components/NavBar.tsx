import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const sharedLinkClass =
  "rounded-full px-4 py-2 text-sm font-medium transition hover:bg-fern/10 hover:text-fern";

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-canvas/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4">
        <nav className="flex items-center gap-2 justify-self-start text-ink">
          <NavLink to="/adopt" className={sharedLinkClass}>
            Adopt
          </NavLink>
          <NavLink to="/browse" className={sharedLinkClass}>
            Browse
          </NavLink>
        </nav>
        <Link to="/" className="flex items-center justify-center gap-3 justify-self-center">
          <img
            src="/Gemini_Generated_Image_8i0jnd8i0jnd8i0j.png"
            alt="PetNest logo"
            className="h-14 w-auto object-contain"
          />
          <span className="text-2xl font-semibold tracking-tight text-ink">PetNest</span>
        </Link>
        <nav className="flex items-center gap-2 justify-self-end text-ink">
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
