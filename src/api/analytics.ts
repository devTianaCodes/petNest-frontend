import type { ListingAnalyticsResponse } from "../types/analytics";
import type { HomeStats } from "../types/home";
import { apiRequest } from "./client";

export function getListingAnalytics() {
  return apiRequest<ListingAnalyticsResponse>("/pets/analytics/mine");
}

export function getHomeStats() {
  return apiRequest<{ stats: HomeStats }>("/pets/stats/public");
}
