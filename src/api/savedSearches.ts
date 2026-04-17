import type { SavedSearch } from "../types/savedSearches";
import { apiRequest } from "./client";

export function getSavedSearches() {
  return apiRequest<{ items: SavedSearch[] }>("/saved-searches");
}

export function createSavedSearch(payload: { label: string; queryString: string }) {
  return apiRequest<{ savedSearch: SavedSearch }>("/saved-searches", {
    method: "POST",
    body: payload
  });
}

export function deleteSavedSearch(id: string) {
  return apiRequest<void>(`/saved-searches/${id}`, {
    method: "DELETE"
  });
}
