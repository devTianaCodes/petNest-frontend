import type { AdoptionRequest } from "../types/adoption";
import { apiRequest } from "./client";

export function createAdoptionRequest(
  listingId: string,
  payload: {
    message: string;
    housingType?: string;
    hasOtherPets?: boolean;
    hasChildren?: boolean;
  }
) {
  return apiRequest<{ request: AdoptionRequest }>(`/adoption-requests/pets/${listingId}`, {
    method: "POST",
    body: payload
  });
}

export function getIncomingRequests() {
  return apiRequest<{ items: AdoptionRequest[] }>("/adoption-requests/incoming");
}

export function getOutgoingRequests() {
  return apiRequest<{ items: AdoptionRequest[] }>("/adoption-requests/outgoing");
}

export function updateAdoptionRequestStatus(id: string, status: string) {
  return apiRequest<{ request: AdoptionRequest }>(`/adoption-requests/${id}/status`, {
    method: "PATCH",
    body: { status }
  });
}
