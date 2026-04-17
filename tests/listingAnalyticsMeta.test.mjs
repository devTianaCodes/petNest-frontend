import assert from "node:assert/strict";
import test from "node:test";
import {
  getAnalyticsCards,
  getTopListingSummary
} from "../dist-tests/src/features/analytics/listingAnalyticsMeta.js";

test("analytics cards summarize key listing metrics", () => {
  const cards = getAnalyticsCards({
    totalListings: 8,
    draftListings: 2,
    pendingListings: 1,
    publishedListings: 3,
    rejectedListings: 1,
    adoptedListings: 1,
    totalRequestsReceived: 9,
    pendingRequestsReceived: 4,
    approvedRequestsReceived: 2,
    totalFavoritesReceived: 7
  });

  assert.deepEqual(cards[0], {
    label: "Live listings",
    value: "3",
    caption: "8 total posts"
  });
  assert.deepEqual(cards[3], {
    label: "Saved by adopters",
    value: "7",
    caption: "2 approved requests"
  });
});

test("top listing summary formats status and engagement", () => {
  const summary = getTopListingSummary({
    id: "listing_1",
    name: "Milo",
    status: "PENDING_APPROVAL",
    updatedAt: "2024-02-04T00:00:00.000Z",
    requestCount: 3,
    favoriteCount: 2
  });

  assert.equal(summary.statusLabel, "Pending approval");
  assert.equal(summary.engagementLabel, "3 requests • 2 saves");
});

test("top listing summary falls back when engagement is zero", () => {
  const summary = getTopListingSummary({
    id: "listing_2",
    name: "Luna",
    status: "DRAFT",
    updatedAt: "2024-02-04T00:00:00.000Z",
    requestCount: 0,
    favoriteCount: 0
  });

  assert.equal(summary.engagementLabel, "No requests or saves yet");
});
