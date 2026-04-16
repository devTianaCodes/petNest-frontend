import assert from "node:assert/strict";
import test from "node:test";
import {
  canOwnerUpdateRequest,
  canWithdrawRequest,
  formatRequestBoolean,
  formatRequestStatus,
  getAdoptionRequestFormState
} from "../dist-tests/src/features/adoption/requestState.js";

test("request formatting helpers cover booleans and statuses", () => {
  assert.equal(formatRequestBoolean(true), "Yes");
  assert.equal(formatRequestBoolean(false), "No");
  assert.equal(formatRequestBoolean(undefined), "Not specified");
  assert.equal(formatRequestStatus("PENDING"), "pending");
  assert.equal(formatRequestStatus("WITHDRAWN"), "withdrawn");
});

test("request action helpers only allow valid state transitions", () => {
  assert.equal(canWithdrawRequest("PENDING"), true);
  assert.equal(canWithdrawRequest("APPROVED"), false);
  assert.equal(canOwnerUpdateRequest("PENDING", "CONTACTED"), true);
  assert.equal(canOwnerUpdateRequest("CONTACTED", "CONTACTED"), false);
  assert.equal(canOwnerUpdateRequest("WITHDRAWN", "APPROVED"), false);
});

test("adoption request form state blocks guests, owners, and short messages", () => {
  const guest = getAdoptionRequestFormState({
    listingStatus: "PUBLISHED",
    message: "This would be a good fit for my home.",
    isSubmitting: false
  });
  const owner = getAdoptionRequestFormState({
    userId: "user_1",
    ownerId: "user_1",
    listingStatus: "PUBLISHED",
    message: "This would be a good fit for my home.",
    isSubmitting: false
  });
  const shortMessage = getAdoptionRequestFormState({
    userId: "user_2",
    ownerId: "user_1",
    listingStatus: "PUBLISHED",
    message: "too short",
    isSubmitting: false
  });

  assert.equal(guest.canSubmit, false);
  assert.match(guest.disabledReason, /Log in/);
  assert.equal(owner.isOwner, true);
  assert.match(owner.disabledReason, /own listing/);
  assert.equal(shortMessage.canSubmit, false);
  assert.match(shortMessage.disabledReason, /20 characters/);
});

test("adoption request form state allows valid authenticated submissions", () => {
  const result = getAdoptionRequestFormState({
    userId: "user_2",
    ownerId: "user_1",
    listingStatus: "PUBLISHED",
    message: "I have a quiet home, prior rescue experience, and room for this pet.",
    isSubmitting: false
  });

  assert.equal(result.canSubmit, true);
  assert.equal(result.trimmedMessage.startsWith("I have"), true);
});
