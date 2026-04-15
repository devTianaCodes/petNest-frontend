import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListing, getMyListings, submitListing } from "../api/pets";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function MyListingsPage() {
  const queryClient = useQueryClient();
  const listingsQuery = useQuery({
    queryKey: ["my-listings"],
    queryFn: getMyListings
  });

  const submitMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "submit" | "mark-adopted" }) => submitListing(id, action),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-ink">My listings</h1>
          <p className="mt-2 text-stone-700">Draft, pending, and published listings all stay in one place.</p>
        </div>
        <Link to="/dashboard/listings/new" className="rounded-full bg-fern px-5 py-3 text-sm font-medium text-white">
          New listing
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {listingsQuery.isError ? (
          <QueryStateNotice
            title="Listings could not load"
            message={(listingsQuery.error as Error).message || "Your listings could not be fetched."}
            tone="error"
          />
        ) : listingsQuery.isLoading ? (
          <QueryStateNotice title="Loading listings" message="Fetching your current drafts and published listings." />
        ) : listingsQuery.data?.items.length ? (
          listingsQuery.data.items.map((listing) => (
          <div key={listing.id} className="space-y-4">
            <PetCard pet={listing} showStatus />
            <div className="flex flex-wrap gap-3">
              {(listing.status === "DRAFT" || listing.status === "REJECTED") && (
                <>
                  <Link
                    to={`/dashboard/listings/${listing.id}/edit`}
                    className="rounded-full border border-ink/10 px-5 py-3 text-sm font-medium text-ink"
                  >
                    Edit listing
                  </Link>
                  <button
                    type="button"
                    className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
                    onClick={() => submitMutation.mutate({ id: listing.id, action: "submit" })}
                  >
                    Submit for approval
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-rose-600 px-5 py-3 text-sm font-medium text-white"
                    onClick={() => deleteMutation.mutate(listing.id)}
                  >
                    Delete
                  </button>
                </>
              )}

              {listing.status === "PUBLISHED" && (
                <button
                  type="button"
                  className="rounded-full bg-sky-700 px-5 py-3 text-sm font-medium text-white"
                  onClick={() => submitMutation.mutate({ id: listing.id, action: "mark-adopted" })}
                >
                  Mark adopted
                </button>
              )}
            </div>
          </div>
          ))
        ) : (
          <QueryStateNotice
            title="No listings yet"
            message="Create your first pet listing to start the adoption flow."
          />
        )}
      </div>
    </div>
  );
}
