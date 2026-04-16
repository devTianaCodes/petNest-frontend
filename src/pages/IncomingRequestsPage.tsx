import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getIncomingRequests, updateAdoptionRequestStatus } from "../api/adoption-requests";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { canOwnerUpdateRequest, formatRequestBoolean, formatRequestStatus } from "../features/adoption/requestState";

export function IncomingRequestsPage() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const requestsQuery = useQuery({
    queryKey: ["incoming-requests"],
    queryFn: getIncomingRequests
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateAdoptionRequestStatus(id, status),
    onSuccess: async (_, variables) => {
      setMessage(`Request ${formatRequestStatus(variables.status as "CONTACTED" | "APPROVED" | "REJECTED")}.`);
      await queryClient.invalidateQueries({ queryKey: ["incoming-requests"] });
    },
    onError: () => {
      setMessage(null);
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Incoming requests</h1>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {requestsQuery.isError ? (
        <QueryStateNotice
          title="Requests could not load"
          message={(requestsQuery.error as Error).message || "Incoming requests could not be fetched."}
          tone="error"
        />
      ) : requestsQuery.isLoading ? (
        <QueryStateNotice title="Loading requests" message="Fetching incoming adoption requests." />
      ) : requestsQuery.data?.items.length ? (
        requestsQuery.data.items.map((request) => {
          const isUpdating = mutation.isPending && mutation.variables?.id === request.id;

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
                    <p className="mt-1 text-sm text-stone-600">
                      From {request.requester?.fullName} • {formatRequestStatus(request.status)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
                      onClick={() => {
                        setMessage(null);
                        mutation.mutate({ id: request.id, status: "CONTACTED" });
                      }}
                      disabled={!canOwnerUpdateRequest(request.status, "CONTACTED") || mutation.isPending}
                    >
                      {isUpdating && mutation.variables?.status === "CONTACTED" ? "Saving..." : "Contacted"}
                    </button>
                    <button
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      onClick={() => {
                        setMessage(null);
                        mutation.mutate({ id: request.id, status: "APPROVED" });
                      }}
                      disabled={!canOwnerUpdateRequest(request.status, "APPROVED") || mutation.isPending}
                    >
                      {isUpdating && mutation.variables?.status === "APPROVED" ? "Saving..." : "Approve"}
                    </button>
                    <button
                      className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      onClick={() => {
                        setMessage(null);
                        mutation.mutate({ id: request.id, status: "REJECTED" });
                      }}
                      disabled={!canOwnerUpdateRequest(request.status, "REJECTED") || mutation.isPending}
                    >
                      {isUpdating && mutation.variables?.status === "REJECTED" ? "Saving..." : "Reject"}
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-stone-700 md:grid-cols-2">
                  <p>Email: {request.requester?.email ?? "Unknown"}</p>
                  <p>Phone: {request.requester?.phone || "Not provided"}</p>
                  <p>
                    Location: {[request.requester?.city, request.requester?.state].filter(Boolean).join(", ") || "Not provided"}
                  </p>
                  <p>Housing: {request.housingType || "Not specified"}</p>
                  <p>Other pets: {formatRequestBoolean(request.hasOtherPets)}</p>
                  <p>Children in home: {formatRequestBoolean(request.hasChildren)}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-700">{request.message}</p>
                {mutation.isError ? <p className="mt-3 text-sm text-rose-700">{(mutation.error as Error).message}</p> : null}
              </div>
            </div>
          </article>
          );
        })
      ) : (
        <QueryStateNotice title="No requests yet" message="Adoption requests for your listings will appear here." />
      )}
    </div>
  );
}
