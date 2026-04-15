import { useMutation, useQuery } from "@tanstack/react-query";
import { getIncomingRequests, updateAdoptionRequestStatus } from "../api/adoption-requests";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function IncomingRequestsPage() {
  const requestsQuery = useQuery({
    queryKey: ["incoming-requests"],
    queryFn: getIncomingRequests
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateAdoptionRequestStatus(id, status)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Incoming requests</h1>
      {requestsQuery.isError ? (
        <QueryStateNotice
          title="Requests could not load"
          message={(requestsQuery.error as Error).message || "Incoming requests could not be fetched."}
          tone="error"
        />
      ) : requestsQuery.isLoading ? (
        <QueryStateNotice title="Loading requests" message="Fetching incoming adoption requests." />
      ) : requestsQuery.data?.items.length ? (
        requestsQuery.data.items.map((request) => (
        <article key={request.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">{request.listing.name}</h2>
              <p className="mt-1 text-sm text-stone-600">From {request.requester?.fullName}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                onClick={() => mutation.mutate({ id: request.id, status: "APPROVED" })}
              >
                Approve
              </button>
              <button
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white"
                onClick={() => mutation.mutate({ id: request.id, status: "REJECTED" })}
              >
                Reject
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-700">{request.message}</p>
        </article>
        ))
      ) : (
        <QueryStateNotice title="No requests yet" message="Adoption requests for your listings will appear here." />
      )}
    </div>
  );
}
