import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const sharedLinkClass =
  "rounded-full px-5 py-3 text-base font-medium transition hover:bg-fern/10 hover:text-fern";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (location.pathname !== "/browse") {
      return;
    }

    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") ?? "");
  }, [location.pathname, location.search]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    navigate(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[#8eaf99] bg-[#cfe0d4]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="grid gap-4 xl:grid-cols-[auto_1fr_auto] xl:items-center">
          <div className="flex flex-wrap items-center gap-2 text-ink">
            <NavLink to="/adopt" className={sharedLinkClass}>
              Adopt
            </NavLink>
            <NavLink to="/browse" className={sharedLinkClass}>
              Browse
            </NavLink>
            <NavLink to="/dashboard/listings/new" className={sharedLinkClass}>
              Post an animal
            </NavLink>
          </div>

          <div className="flex items-center xl:justify-self-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="PetNest logo" className="h-14 w-auto object-contain" />
              <span className="text-2xl font-semibold tracking-tight text-ink">PetNest</span>
            </Link>
          </div>

          <nav className="flex flex-wrap items-center justify-end gap-2 text-ink">
            {user?.role === "ADMIN" ? (
              <NavLink to="/admin" className={sharedLinkClass}>
                Admin
              </NavLink>
            ) : null}
            <form
              onSubmit={submitSearch}
              className="grid w-full gap-3 sm:grid-cols-[minmax(0,280px)_auto] xl:w-auto xl:min-w-[360px]"
            >
              <input
                placeholder="Search animals"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-ink"
              />
              <button type="submit" className="rounded-full bg-fern px-5 py-3 text-sm font-medium text-white">
                Search
              </button>
            </form>
            <Link
              to={user ? "/dashboard" : "/auth"}
              aria-label={user ? "Open your dashboard" : "Open login and registration"}
              title={user ? "Dashboard" : "Account"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white transition hover:border-fern/40 hover:text-fern"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
              </svg>
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white"
              >
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
