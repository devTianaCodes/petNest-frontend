import type { PetListResponse, PetListing } from "../types/pets";
import { apiRequest } from "./client";

export type ListingPayload = {
  categoryId: string;
  name: string;
  description: string;
  ageLabel: string;
  sex: "MALE" | "FEMALE" | "UNKNOWN";
  size: "SMALL" | "MEDIUM" | "LARGE" | "UNKNOWN";
  breed?: string;
  city: string;
  state: string;
  contactEmail: string;
  contactPhone?: string;
  rescueStory?: string;
  healthNotes?: string;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
};

export function getPets(params: URLSearchParams) {
  return apiRequest<PetListResponse>(`/pets?${params.toString()}`);
}

export function getPet(id: string) {
  return apiRequest<{ listing: PetListing }>(`/pets/${id}`);
}

export function getMyListings() {
  return apiRequest<{ items: PetListing[] }>("/pets/mine");
}

export function createListing(payload: ListingPayload) {
  return apiRequest<{ listing: PetListing }>("/pets", {
    method: "POST",
    body: payload
  });
}

export function updateListing(id: string, payload: ListingPayload) {
  return apiRequest<{ listing: PetListing }>(`/pets/${id}`, {
    method: "PATCH",
    body: payload
  });
}

export function submitListing(id: string, action: "submit" | "mark-adopted") {
  return apiRequest<{ listing: PetListing }>(`/pets/${id}/status`, {
    method: "PATCH",
    body: { action }
  });
}

export function uploadListingImages(id: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return apiRequest<{ images: { id: string; imageUrl: string }[] }>(`/pets/${id}/images`, {
    method: "POST",
    formData
  });
}
