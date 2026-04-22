import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="rounded-[32px] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Page not found</h1>
      <p className="mt-3 text-stone-700">The page you requested does not exist in this scaffold.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/home" className="rounded-full bg-fern px-5 py-3 text-sm font-medium text-white">
          Go home
        </Link>
        <Link to="/adopt" className="rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-ink">
          Browse animals
        </Link>
      </div>
    </div>
  );
}
