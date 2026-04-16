import assert from "node:assert/strict";
import test from "node:test";
import { getCreateListingProgress } from "../dist-tests/src/features/pets/createListingFlow.js";

test("create listing flow starts with save step before draft exists", () => {
  const progress = getCreateListingProgress({
    hasListingId: false,
    hasUploadedImages: false
  });

  assert.equal(progress.title, "Step 1 of 2");
  assert.match(progress.description, /create a draft listing/i);
});

test("create listing flow shows review-ready state after images upload", () => {
  const progress = getCreateListingProgress({
    hasListingId: true,
    hasUploadedImages: true
  });

  assert.equal(progress.title, "Ready for review");
  assert.match(progress.description, /submit it for approval/i);
});
