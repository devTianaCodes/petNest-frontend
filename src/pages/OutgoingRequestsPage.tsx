import { useQuery } from "@tanstack/react-query";
import { getOutgoingRequests } from "../api/adoption-requests";

export function OutgoingRequestsPage() {
  const requestsQuery = useQuery({
    queryKey: ["outgoing-requests"],
    queryFn: getOutgoingRequests
  });

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Outgoing requests</h1>
      {requestsQuery.data?.items.map((request) => (
        <article key={request.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">{request.listing.name}</h2>
          <p className="mt-2 text-sm text-stone-700">{request.message}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-fern">{request.status}</p>
        </article>
      ))}
    </div>
  );
}
