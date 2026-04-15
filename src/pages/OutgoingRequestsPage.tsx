import { useQuery } from "@tanstack/react-query";
import { getOutgoingRequests } from "../api/adoption-requests";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function OutgoingRequestsPage() {
  const requestsQuery = useQuery({
    queryKey: ["outgoing-requests"],
    queryFn: getOutgoingRequests
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Outgoing requests</h1>
      {requestsQuery.isError ? (
        <QueryStateNotice
          title="Requests could not load"
          message={(requestsQuery.error as Error).message || "Outgoing requests could not be fetched."}
          tone="error"
        />
      ) : requestsQuery.isLoading ? (
        <QueryStateNotice title="Loading requests" message="Fetching the requests you have sent." />
      ) : requestsQuery.data?.items.length ? (
        requestsQuery.data.items.map((request) => (
        <article key={request.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">{request.listing.name}</h2>
          <p className="mt-2 text-sm text-stone-700">{request.message}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-fern">{request.status}</p>
        </article>
        ))
      ) : (
        <QueryStateNotice title="No requests sent yet" message="Listings you apply for will appear here." />
      )}
    </div>
  );
}
