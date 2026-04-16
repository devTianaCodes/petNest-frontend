import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { approveListing, getPendingListings, rejectListing } from "../api/admin";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function AdminPendingListingsPage() {
  const queryClient = useQueryClient();
  const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const pendingQuery = useQuery({
    queryKey: ["admin-pending"],
    queryFn: getPendingListings
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveListing(id),
    onSuccess: async () => {
      setMessage("Listing approved.");
      setSelectedRejectId(null);
      setRejectionReason("");
      await queryClient.invalidateQueries({ queryKey: ["admin-pending"] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => rejectListing(id, rejectionReason),
    onSuccess: async () => {
      setMessage("Listing rejected.");
      setSelectedRejectId(null);
      setRejectionReason("");
      await queryClient.invalidateQueries({ queryKey: ["admin-pending"] });
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Pending listings</h1>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {approveMutation.isError ? <p className="text-sm text-rose-700">{(approveMutation.error as Error).message}</p> : null}
      {rejectMutation.isError ? <p className="text-sm text-rose-700">{(rejectMutation.error as Error).message}</p> : null}
      {pendingQuery.isError ? (
        <QueryStateNotice
          title="Pending listings could not load"
          message={(pendingQuery.error as Error).message || "The moderation queue could not be fetched."}
          tone="error"
        />
      ) : pendingQuery.isLoading ? (
        <QueryStateNotice title="Loading moderation queue" message="Fetching pending pet listings." />
      ) : pendingQuery.data?.items.length ? (
        pendingQuery.data.items.map((listing) => {
          const isApproving = approveMutation.isPending && approveMutation.variables === listing.id;
          const isRejecting = rejectMutation.isPending && rejectMutation.variables?.id === listing.id;

          return (
            <article key={listing.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">{listing.name}</h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {listing.owner?.fullName} • {listing.city}, {listing.state}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    onClick={() => approveMutation.mutate(listing.id)}
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    onClick={() => {
                      setMessage(null);
                      setSelectedRejectId(listing.id);
                      setRejectionReason(listing.rejectionReason ?? "");
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-stone-700">{listing.description}</p>
              {selectedRejectId === listing.id ? (
                <div className="mt-4 space-y-3 rounded-3xl bg-sand/35 p-4">
                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    className="min-h-28 w-full rounded-2xl border border-stone-200 px-4 py-3"
                    placeholder="Tell the owner what needs to change before resubmission."
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                      disabled={rejectMutation.isPending || rejectionReason.trim().length < 10}
                      onClick={() => rejectMutation.mutate({ id: listing.id, rejectionReason: rejectionReason.trim() })}
                    >
                      {isRejecting ? "Rejecting..." : "Confirm rejection"}
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-ink"
                      onClick={() => {
                        setSelectedRejectId(null);
                        setRejectionReason("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })
      ) : (
        <QueryStateNotice title="No pending listings" message="Nothing is waiting for admin review right now." />
      )}
    </div>
  );
}
