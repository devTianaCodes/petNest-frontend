import type { FavoriteItem } from "../types/favorites";
import { apiRequest } from "./client";

export function getFavorites() {
  return apiRequest<{ items: FavoriteItem[] }>("/favorites");
}

export function addFavorite(listingId: string) {
  return apiRequest<{ favorite: { id: string } }>(`/favorites/${listingId}`, {
    method: "POST"
  });
}

export function removeFavorite(listingId: string) {
  return apiRequest<void>(`/favorites/${listingId}`, {
    method: "DELETE"
  });
}
