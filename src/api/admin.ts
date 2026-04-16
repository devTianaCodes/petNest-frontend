import type { AuthUser } from "../types/auth";
import type { PetListing } from "../types/pets";
import { apiRequest } from "./client";

export function getPendingListings() {
  return apiRequest<{ items: PetListing[] }>("/admin/pets/pending");
}

export function approveListing(id: string) {
  return apiRequest<{ listing: PetListing }>(`/admin/pets/${id}/approve`, {
    method: "PATCH"
  });
}

export function rejectListing(id: string, rejectionReason: string) {
  return apiRequest<{ listing: PetListing }>(`/admin/pets/${id}/reject`, {
    method: "PATCH",
    body: { rejectionReason }
  });
}

export function getUsers() {
  return apiRequest<{ users: AuthUser[] }>("/admin/users");
}

export function updateUserStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
  return apiRequest<{ user: AuthUser }>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: { status }
  });
}
