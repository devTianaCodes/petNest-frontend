import assert from "node:assert/strict";
import test from "node:test";
import { getCreateListingProgress, getCreateListingSubmitState } from "../dist-tests/src/features/pets/createListingFlow.js";

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

test("create listing submit state requires verified email and uploaded images", () => {
  const unverified = getCreateListingSubmitState({
    hasListingId: true,
    hasUploadedImages: true,
    isEmailVerified: false,
    isSubmitting: false
  });
  const verified = getCreateListingSubmitState({
    hasListingId: true,
    hasUploadedImages: true,
    isEmailVerified: true,
    isSubmitting: false
  });

  assert.equal(unverified.canSubmit, false);
  assert.match(unverified.description, /Verify your email/i);
  assert.equal(verified.canSubmit, true);
});
