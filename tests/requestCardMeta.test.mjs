import assert from "node:assert/strict";
import test from "node:test";
import { getRequestCardMeta } from "../dist-tests/src/features/adoption/requestCardMeta.js";

test("request card meta formats submission date, status, and listing location", () => {
  const result = getRequestCardMeta({
    status: "PENDING",
    createdAt: "2024-02-10T00:00:00.000Z",
    listing: {
      id: "pet_1",
      name: "Milo",
      city: "Boston",
      state: "MA"
    }
  });

  assert.equal(result.statusLabel, "pending");
  assert.equal(result.listingLocation, "Boston, MA");
  assert.match(result.submittedLabel, /2024/);
});
