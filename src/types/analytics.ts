import type { ListingStatus } from "./pets";

export type ListingAnalyticsStats = {
  totalListings: number;
  draftListings: number;
  pendingListings: number;
  publishedListings: number;
  rejectedListings: number;
  adoptedListings: number;
  totalRequestsReceived: number;
  pendingRequestsReceived: number;
  approvedRequestsReceived: number;
  totalFavoritesReceived: number;
};

export type TopListingAnalytics = {
  id: string;
  name: string;
  status: ListingStatus;
  updatedAt: string;
  requestCount: number;
  favoriteCount: number;
};

export type ListingAnalyticsResponse = {
  stats: ListingAnalyticsStats;
  topListings: TopListingAnalytics[];
};
