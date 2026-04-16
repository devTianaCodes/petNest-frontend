import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListing, getMyListings, submitListing } from "../api/pets";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function MyListingsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const listingsQuery = useQuery({
    queryKey: ["my-listings"],
    queryFn: getMyListings
  });

  const submitMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "submit" | "mark-adopted" }) => submitListing(id, action),
    onSuccess: async (_, variables) => {
      setError(null);
      setMessage(variables.action === "submit" ? "Listing submitted for approval." : "Listing marked as adopted.");
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (mutationError) => {
      setError((mutationError as Error).message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: async () => {
      setError(null);
      setMessage("Listing deleted.");
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (mutationError) => {
      setError((mutationError as Error).message);
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
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

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
        listingsQuery.data.items.map((listing) => {
          const isSubmittingForApproval =
            submitMutation.isPending && submitMutation.variables?.id === listing.id && submitMutation.variables.action === "submit";
          const isMarkingAdopted =
            submitMutation.isPending && submitMutation.variables?.id === listing.id && submitMutation.variables.action === "mark-adopted";
          const isDeleting = deleteMutation.isPending && deleteMutation.variables === listing.id;

          return (
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
                      disabled={submitMutation.isPending || deleteMutation.isPending}
                      className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
                      onClick={() => {
                        setMessage(null);
                        setError(null);
                        submitMutation.mutate({ id: listing.id, action: "submit" });
                      }}
                    >
                      {isSubmittingForApproval ? "Submitting..." : "Submit for approval"}
                    </button>
                    <button
                      type="button"
                      disabled={submitMutation.isPending || deleteMutation.isPending}
                      className="rounded-full bg-rose-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
                      onClick={() => {
                        if (!window.confirm(`Delete ${listing.name}? This cannot be undone.`)) {
                          return;
                        }
                        setMessage(null);
                        setError(null);
                        deleteMutation.mutate(listing.id);
                      }}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}

                {listing.status === "PUBLISHED" && (
                  <button
                    type="button"
                    disabled={submitMutation.isPending || deleteMutation.isPending}
                    className="rounded-full bg-sky-700 px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
                    onClick={() => {
                      if (!window.confirm(`Mark ${listing.name} as adopted?`)) {
                        return;
                      }
                      setMessage(null);
                      setError(null);
                      submitMutation.mutate({ id: listing.id, action: "mark-adopted" });
                    }}
                  >
                    {isMarkingAdopted ? "Updating..." : "Mark adopted"}
                  </button>
                )}
              </div>
            </div>
          );
        })
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
