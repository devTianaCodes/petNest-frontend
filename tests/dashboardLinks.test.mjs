import assert from "node:assert/strict";
import test from "node:test";
import { getDashboardLinks } from "../dist-tests/src/features/dashboard/dashboardLinks.js";

test("dashboard links include new listing guidance for unverified users", () => {
  const links = getDashboardLinks({
    role: "USER",
    isEmailVerified: false
  });

  const newListing = links.find((link) => link.to === "/dashboard/listings/new");
  assert.ok(newListing);
  assert.match(newListing.description, /after verifying your email/i);
});

test("dashboard links include moderation queue for admins", () => {
  const links = getDashboardLinks({
    role: "ADMIN",
    isEmailVerified: true
  });

  assert.ok(links.find((link) => link.to === "/admin/pending"));
});
