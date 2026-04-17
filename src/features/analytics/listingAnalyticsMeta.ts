import type { ListingAnalyticsStats, TopListingAnalytics } from "../../types/analytics";

export function getAnalyticsCards(stats: ListingAnalyticsStats) {
  return [
    {
      label: "Live listings",
      value: String(stats.publishedListings),
      caption: `${stats.totalListings} total posts`
    },
    {
      label: "Pending review",
      value: String(stats.pendingListings),
      caption: `${stats.draftListings} drafts still editable`
    },
    {
      label: "Requests received",
      value: String(stats.totalRequestsReceived),
      caption: `${stats.pendingRequestsReceived} still waiting`
    },
    {
      label: "Saved by adopters",
      value: String(stats.totalFavoritesReceived),
      caption: `${stats.approvedRequestsReceived} approved requests`
    }
  ];
}

export function getTopListingSummary(listing: TopListingAnalytics) {
  const statusLabel = listing.status.replace(/_/g, " ").toLowerCase();
  const engagementCount = listing.requestCount + listing.favoriteCount;

  return {
    statusLabel: statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1),
    engagementLabel:
      engagementCount > 0
        ? `${listing.requestCount} requests • ${listing.favoriteCount} saves`
        : "No requests or saves yet"
  };
}
