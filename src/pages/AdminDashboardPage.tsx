import { Link } from "react-router-dom";

export function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">Admin</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Moderation dashboard</h1>
        <p className="mt-4 text-stone-700">Review pending listings and keep the trust baseline consistent.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/pending" className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">Pending listings</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">Approve or reject new adoption listings.</p>
        </Link>
        <Link to="/admin/users" className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">User management</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">Inspect accounts and prepare for moderation actions.</p>
        </Link>
      </div>
    </div>
  );
}
