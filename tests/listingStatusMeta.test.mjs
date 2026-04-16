import assert from "node:assert/strict";
import test from "node:test";
import { getListingStatusMeta } from "../dist-tests/src/features/pets/listingStatusMeta.js";

test("listing status meta explains pending and published states", () => {
  const pending = getListingStatusMeta({ status: "PENDING_APPROVAL", rejectionReason: null });
  const published = getListingStatusMeta({ status: "PUBLISHED", rejectionReason: null });

  assert.equal(pending.title, "Pending approval");
  assert.match(pending.description, /admin review/i);
  assert.equal(published.title, "Published");
  assert.match(published.description, /live on PetNest/i);
});

test("listing status meta appends rejection reason when present", () => {
  const rejected = getListingStatusMeta({
    status: "REJECTED",
    rejectionReason: "Please add at least one clear profile photo."
  });

  assert.equal(rejected.title, "Needs changes");
  assert.match(rejected.description, /Please add at least one clear profile photo\./);
});
