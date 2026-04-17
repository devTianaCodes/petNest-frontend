import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getReports, updateReportStatus } from "../api/reports";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { getReportMeta } from "../features/admin/reportMeta";

export function AdminReportsPage() {
  const queryClient = useQueryClient();
  const reportsQuery = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getReports
  });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "RESOLVED" | "DISMISSED" }) => updateReportStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Listing reports</h1>
      {mutation.isError ? <p className="text-sm text-rose-700">{(mutation.error as Error).message}</p> : null}
      {reportsQuery.isError ? (
        <QueryStateNotice
          title="Reports could not load"
          message={(reportsQuery.error as Error).message || "The report queue could not be fetched."}
          tone="error"
        />
      ) : reportsQuery.isLoading ? (
        <QueryStateNotice title="Loading reports" message="Fetching listing reports from adopters." />
      ) : reportsQuery.data?.items.length ? (
        reportsQuery.data.items.map((report) => {
          const meta = getReportMeta(report);
          const isResolving = mutation.isPending && mutation.variables?.id === report.id && mutation.variables.status === "RESOLVED";
          const isDismissing = mutation.isPending && mutation.variables?.id === report.id && mutation.variables.status === "DISMISSED";

          return (
            <article key={report.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-wrap items-start gap-5">
                <img src={meta.coverImage} alt={report.listing.name} className="h-32 w-40 rounded-[24px] object-cover" />
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">Report</p>
                      <h2 className="mt-1 text-2xl font-semibold text-ink">{report.listing.name}</h2>
                      <p className="mt-1 text-sm text-stone-600">
                        {meta.listingLocation} • Reported by {report.reporter.fullName}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate({ id: report.id, status: "RESOLVED" })}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      >
                        {isResolving ? "Resolving..." : "Resolve"}
                      </button>
                      <button
                        type="button"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate({ id: report.id, status: "DISMISSED" })}
                        className="rounded-full bg-stone-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      >
                        {isDismissing ? "Dismissing..." : "Dismiss"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-stone-700 md:grid-cols-2">
                    <p>Reason: {report.reason}</p>
                    <p>Reporter location: {meta.reporterLocation}</p>
                  </div>

                  {report.details ? <p className="text-sm leading-6 text-stone-700">{report.details}</p> : null}

                  <div className="flex flex-wrap gap-3">
                    <Link to={`/pets/${report.listing.id}`} className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink">
                      Open listing
                    </Link>
                    <a href={`mailto:${report.reporter.email}`} className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink">
                      Email reporter
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })
      ) : (
        <QueryStateNotice title="No open reports" message="Nothing has been flagged for moderation right now." />
      )}
    </div>
  );
}
