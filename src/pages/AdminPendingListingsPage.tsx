import { useMutation, useQuery } from "@tanstack/react-query";
import { approveListing, getPendingListings, rejectListing } from "../api/admin";

export function AdminPendingListingsPage() {
  const pendingQuery = useQuery({
    queryKey: ["admin-pending"],
    queryFn: getPendingListings
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveListing(id)
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => rejectListing(id, rejectionReason)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Pending listings</h1>
      {pendingQuery.data?.items.map((listing) => (
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
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                onClick={() => approveMutation.mutate(listing.id)}
              >
                Approve
              </button>
              <button
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white"
                onClick={() => rejectMutation.mutate({ id: listing.id, rejectionReason: "Needs clearer photos or details." })}
              >
                Reject
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-700">{listing.description}</p>
        </article>
      ))}
    </div>
  );
}
