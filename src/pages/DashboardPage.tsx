import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Welcome back, {user?.fullName || "PetNest user"}.</h1>
        <p className="mt-4 text-stone-700">
          Email status:{" "}
          <span className={user?.isEmailVerified ? "text-emerald-700" : "text-amber-700"}>
            {user?.isEmailVerified ? "Verified" : "Verification pending"}
          </span>
        </p>
        {!user?.isEmailVerified ? (
          <div className="mt-5 rounded-3xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
            Verify your email before submitting listings for approval. You can still draft and edit listings in the meantime.
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["/dashboard/listings", "My listings", "Create, edit, submit, and review status changes on your adoption posts."],
          ["/dashboard/requests/incoming", "Incoming requests", "Review adoption requests from interested adopters."],
          ["/dashboard/requests/outgoing", "Outgoing requests", "Track the requests you have submitted to other listing owners."],
          ["/dashboard/profile", "Profile settings", "Keep your name, city, and contact details up to date."]
        ].map(([to, title, description]) => (
          <Link key={to} to={to} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-semibold text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
