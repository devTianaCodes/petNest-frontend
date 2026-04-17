import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getOutgoingRequests, updateAdoptionRequestStatus } from "../api/adoption-requests";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { canWithdrawRequest, formatRequestBoolean } from "../features/adoption/requestState";
import { getRequestCardMeta } from "../features/adoption/requestCardMeta";

export function OutgoingRequestsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const requestsQuery = useQuery({
    queryKey: ["outgoing-requests"],
    queryFn: getOutgoingRequests
  });
  const mutation = useMutation({
    mutationFn: (id: string) => updateAdoptionRequestStatus(id, "WITHDRAWN"),
    onSuccess: async () => {
      setMessage("Request withdrawn.");
      await queryClient.invalidateQueries({ queryKey: ["outgoing-requests"] });
    },
    onError: () => {
      setMessage(null);
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Outgoing requests</h1>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {requestsQuery.isError ? (
        <QueryStateNotice
          title="Requests could not load"
          message={(requestsQuery.error as Error).message || "Outgoing requests could not be fetched."}
          tone="error"
        />
      ) : requestsQuery.isLoading ? (
        <QueryStateNotice title="Loading requests" message="Fetching the requests you have sent." />
      ) : requestsQuery.data?.items.length ? (
        requestsQuery.data.items.map((request) => {
          const meta = getRequestCardMeta(request);
          const isWithdrawing = mutation.isPending && mutation.variables === request.id;

          return (
          <article key={request.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-start gap-5">
              <img
                src={request.listing.images?.[0]?.imageUrl ?? "https://placehold.co/320x220?text=PetNest"}
                alt={request.listing.name}
                className="h-28 w-36 rounded-[20px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fern">
                      {request.listing.category?.name ?? "Listing"}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-ink">{request.listing.name}</h2>
                    <p className="mt-1 text-sm text-stone-600">{meta.listingLocation}</p>
                    <p className="mt-1 text-sm text-stone-500">Submitted {meta.submittedLabel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fern">{meta.statusLabel}</p>
                    {canWithdrawRequest(request.status) ? (
                      <button
                        type="button"
                        className="mt-3 rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
                        onClick={() => {
                          setMessage(null);
                          mutation.mutate(request.id);
                        }}
                        disabled={mutation.isPending}
                      >
                        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-stone-700 md:grid-cols-2">
                  <p>Housing: {request.housingType || "Not specified"}</p>
                  <p>Other pets: {formatRequestBoolean(request.hasOtherPets)}</p>
                  <p>Children in home: {formatRequestBoolean(request.hasChildren)}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-700">{request.message}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to={`/pets/${request.listing.id}`} className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-ink">
                    Open listing
                  </Link>
                  {!canWithdrawRequest(request.status) ? (
                    <p className="text-sm text-stone-500">This request is no longer withdrawable because it has reached a final decision.</p>
                  ) : null}
                </div>
                {mutation.isError ? <p className="mt-3 text-sm text-rose-700">{(mutation.error as Error).message}</p> : null}
              </div>
            </div>
          </article>
          );
        })
      ) : (
        <QueryStateNotice title="No requests sent yet" message="Listings you apply for will appear here." />
      )}
    </div>
  );
}
