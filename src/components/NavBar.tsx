import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getProtectedRedirect } from "../features/auth/authRedirect";
import { useAuth } from "../features/auth/AuthContext";

const sharedLinkClass =
  "rounded-full px-3.5 py-1 text-xs font-medium transition hover:bg-fern/10 hover:text-fern md:px-3.5 md:py-1 md:text-sm lg:px-4 lg:py-1.5 lg:text-sm";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/browse") {
      return;
    }

    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") ?? "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    navigate(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function renderSearchForm(formClassName: string) {
    return (
      <form onSubmit={submitSearch} className={formClassName}>
        <input
          placeholder="Search animals"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="min-w-0 flex-1 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs text-ink outline-none focus:border-fern focus:outline-none focus:ring-0 md:px-4 md:py-1.5 md:text-sm"
        />
        <button type="submit" className="shrink-0 rounded-full bg-fern px-3.5 py-1.5 text-xs font-medium text-white md:px-4.5 md:py-1.5 md:text-sm">
          Search
        </button>
      </form>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#8eaf99] bg-[#cfe0d4]">
      <div className="mx-auto max-w-6xl px-5 py-1.5 md:py-2">
        <div className="hidden xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-1 text-ink xl:justify-self-start">
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

          <div className="flex items-center justify-center xl:justify-self-center">
            <Link to="/home" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="PetNest logo" className="h-9 w-auto object-contain 2xl:h-11" />
              <span className="text-[1.2rem] font-semibold tracking-tight text-ink 2xl:text-[1.35rem]">PetNest</span>
            </Link>
          </div>

          <nav className="flex min-w-0 w-full flex-nowrap items-center justify-end gap-0 text-ink xl:justify-self-end">
            {user?.role === "ADMIN" ? (
              <NavLink to="/admin" className={sharedLinkClass}>
                Admin
              </NavLink>
            ) : null}
            {renderSearchForm("ml-2 flex min-w-[250px] max-w-[420px] flex-1 items-center gap-1.5 2xl:min-w-[300px] 2xl:max-w-[520px]")}
            <Link
              to={user ? "/dashboard/favorites" : getProtectedRedirect("/dashboard/favorites")}
              aria-label={user ? "Open saved favorites" : "Log in to view favorites"}
              title={user ? "Favorites" : "Log in to view favorites"}
              className="ml-1.5 inline-flex items-center justify-center px-1 py-1 text-[1.05rem] transition hover:text-fern 2xl:ml-2 2xl:text-[1.15rem]"
            >
              ♥
            </Link>
            <Link
              to={user ? "/dashboard" : "/auth"}
              aria-label={user ? "Open your dashboard" : "Open login and registration"}
              title={user ? "Dashboard" : "Account"}
              className="inline-flex items-center justify-center px-1 py-1 transition hover:text-fern"
            >
              <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem] 2xl:h-[1.15rem] 2xl:w-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
              </svg>
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-white"
              >
                Logout
              </button>
            ) : null}
          </nav>
        </div>

        <div className="xl:hidden">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full text-ink transition hover:bg-fern/10 sm:h-9.5 sm:w-9.5"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                {mobileMenuOpen ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>

            <Link to="/home" className="flex items-center gap-2 sm:gap-2.5">
              <img src="/logo.png" alt="PetNest logo" className="h-8 w-auto object-contain sm:h-9 md:h-10" />
              <span className="text-[1.05rem] font-semibold tracking-tight text-ink sm:text-[1.15rem] md:text-[1.2rem]">PetNest</span>
            </Link>

            <div className="flex items-center gap-1 text-ink">
              <Link
                to={user ? "/dashboard/favorites" : getProtectedRedirect("/dashboard/favorites")}
                aria-label={user ? "Open saved favorites" : "Log in to view favorites"}
                title={user ? "Favorites" : "Log in to view favorites"}
                className="inline-flex items-center justify-center px-1 py-1 text-[1rem] transition hover:text-fern sm:text-[1.05rem]"
              >
                ♥
              </Link>
              <Link
                to={user ? "/dashboard" : "/auth"}
                aria-label={user ? "Open your dashboard" : "Open login and registration"}
                title={user ? "Dashboard" : "Account"}
                className="inline-flex items-center justify-center px-1 py-1 transition hover:text-fern"
              >
                <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem] sm:h-[1.1rem] sm:w-[1.1rem]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                  <path d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-2">{renderSearchForm("flex items-center gap-2")}</div>

          {mobileMenuOpen ? (
            <div className="mt-2 rounded-[24px] bg-white/70 p-2 text-ink ring-1 ring-black/5">
              <div className="flex flex-col gap-1">
                <NavLink to="/adopt" className={sharedLinkClass}>
                  Adopt
                </NavLink>
                <NavLink to="/browse" className={sharedLinkClass}>
                  Browse
                </NavLink>
                <NavLink to="/dashboard/listings/new" className={sharedLinkClass}>
                  Post an animal
                </NavLink>
                {user?.role === "ADMIN" ? (
                  <NavLink to="/admin" className={sharedLinkClass}>
                    Admin
                  </NavLink>
                ) : null}
                {user ? (
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="rounded-full bg-ink px-3.5 py-1.5 text-left text-xs font-medium text-white"
                  >
                    Logout
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
