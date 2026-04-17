import assert from "node:assert/strict";
import test from "node:test";
import { getReportMeta } from "../dist-tests/src/features/admin/reportMeta.js";

test("report meta formats locations and cover image", () => {
  const meta = getReportMeta({
    id: "report_1",
    reason: "Spam",
    status: "OPEN",
    createdAt: "2024-02-01T00:00:00.000Z",
    listing: {
      id: "listing_1",
      name: "Milo",
      city: "Austin",
      state: "Texas",
      images: [{ id: "img_1", imageUrl: "https://example.com/pet.jpg", sortOrder: 0 }]
    },
    reporter: {
      id: "user_1",
      fullName: "Reporter",
      email: "reporter@petnest.local",
      city: "Dallas",
      state: "Texas"
    }
  });

  assert.equal(meta.listingLocation, "Austin, Texas");
  assert.equal(meta.reporterLocation, "Dallas, Texas");
  assert.equal(meta.coverImage, "https://example.com/pet.jpg");
});
