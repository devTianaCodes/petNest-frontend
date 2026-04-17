import type { AdoptionRequest } from "../../types/adoption";

export function getRequestCardMeta(request: Pick<AdoptionRequest, "status" | "createdAt" | "listing">) {
  const submittedLabel = new Date(request.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const statusLabel = request.status.replace(/_/g, " ").toLowerCase();
  const listingLocation = [request.listing.city, request.listing.state].filter(Boolean).join(", ");

  return {
    submittedLabel,
    statusLabel,
    listingLocation
  };
}
