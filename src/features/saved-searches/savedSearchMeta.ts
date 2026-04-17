import type { BrowseFilters } from "../pets/browseParams";
import type { SavedSearch } from "../../types/savedSearches";

export function createSavedSearchLabel(filters: BrowseFilters) {
  if (filters.search) {
    return `Search: ${filters.search}`;
  }

  if (filters.category && filters.city) {
    return `${capitalize(filters.category)} in ${filters.city}`;
  }

  if (filters.category) {
    return `${capitalize(filters.category)} listings`;
  }

  if (filters.city || filters.state) {
    return `Pets near ${[filters.city, filters.state].filter(Boolean).join(", ")}`;
  }

  return "Saved PetNest search";
}

export function createSavedSearchLink(search: SavedSearch) {
  return `/browse${search.queryString ? `?${search.queryString}` : ""}`;
}

export function getSavedSearchSummary(search: SavedSearch) {
  if (!search.queryString) {
    return "All published animals";
  }

  return search.queryString.replace(/&/g, " • ").replace(/=/g, ": ");
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
