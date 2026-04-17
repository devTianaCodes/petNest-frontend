import assert from "node:assert/strict";
import test from "node:test";
import { canSubmitListingReport } from "../dist-tests/src/features/reports/reportForm.js";

test("report form blocks owners and short details", () => {
  const result = canSubmitListingReport({
    reason: "Spam",
    details: "short",
    isOwner: true,
    isSubmitting: false
  });

  assert.equal(result.canSubmit, false);
});

test("report form allows non-owner reports with enough detail", () => {
  const result = canSubmitListingReport({
    reason: "Spam",
    details: "This listing looks copied from another site.",
    isOwner: false,
    isSubmitting: false
  });

  assert.equal(result.canSubmit, true);
});
