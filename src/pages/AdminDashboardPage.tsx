import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPendingListings, getUsers } from "../api/admin";
import { getReports } from "../api/reports";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { getAdminDashboardStats } from "../features/admin/adminDashboardStats";

export function AdminDashboardPage() {
  const pendingQuery = useQuery({
    queryKey: ["admin-pending"],
    queryFn: getPendingListings
  });
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers
  });
  const reportsQuery = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getReports
  });

  const stats = getAdminDashboardStats({
    pendingListings: pendingQuery.data?.items ?? [],
    users: usersQuery.data?.users ?? []
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">Admin</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Moderation dashboard</h1>
        <p className="mt-4 text-stone-700">Review pending listings and keep the trust baseline consistent.</p>
      </section>

      {pendingQuery.isError || usersQuery.isError || reportsQuery.isError ? (
        <QueryStateNotice
          title="Admin data could not load"
          message={
            (pendingQuery.error as Error | undefined)?.message ||
            (usersQuery.error as Error | undefined)?.message ||
            (reportsQuery.error as Error | undefined)?.message ||
            "Dashboard moderation stats could not be fetched."
          }
          tone="error"
        />
      ) : pendingQuery.isLoading || usersQuery.isLoading || reportsQuery.isLoading ? (
        <QueryStateNotice title="Loading admin overview" message="Fetching pending listings and user moderation stats." />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Pending listings", String(stats.pendingListings), "Needs review"],
              ["Total users", String(stats.totalUsers), "Registered accounts"],
              ["Verified users", String(stats.verifiedUsers), "Ready to publish"],
              ["Suspended users", String(stats.suspendedUsers), "Restricted accounts"]
            ].map(([label, value, caption]) => (
              <article key={label} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-medium text-stone-500">{label}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{value}</p>
                <p className="mt-2 text-sm text-stone-700">{caption}</p>
              </article>
            ))}
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/admin/pending" className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">Pending listings</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-700">Approve or reject new adoption listings.</p>
                </div>
                <span className="rounded-full bg-terracotta/10 px-4 py-2 text-sm font-semibold text-terracotta">
                  {stats.pendingListings}
                </span>
              </div>
            </Link>
            <Link to="/admin/users" className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">User management</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-700">Inspect accounts, verification state, and suspensions.</p>
                </div>
                <span className="rounded-full bg-fern/10 px-4 py-2 text-sm font-semibold text-fern">
                  {stats.totalUsers}
                </span>
              </div>
            </Link>
            <Link to="/admin/reports" className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">Reported listings</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-700">Review flags from adopters for spam, fraud, or safety concerns.</p>
                </div>
                <span className="rounded-full bg-terracotta/10 px-4 py-2 text-sm font-semibold text-terracotta">
                  {reportsQuery.data?.items.length ?? 0}
                </span>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
