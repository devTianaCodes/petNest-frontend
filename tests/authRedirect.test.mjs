import assert from "node:assert/strict";
import test from "node:test";
import { getPostLoginRedirect, getProtectedRedirect } from "../dist-tests/src/features/auth/authRedirect.js";

test("protected redirect preserves the intended path and query", () => {
  const redirect = getProtectedRedirect("/dashboard/listings/new", "?step=images");

  assert.equal(redirect, "/auth?redirect=%2Fdashboard%2Flistings%2Fnew%3Fstep%3Dimages");
});

test("post-login redirect falls back for unsafe or blocked targets", () => {
  assert.equal(getPostLoginRedirect(null), "/dashboard");
  assert.equal(getPostLoginRedirect("https://evil.example"), "/dashboard");
  assert.equal(getPostLoginRedirect("//evil.example/path"), "/dashboard");
  assert.equal(getPostLoginRedirect("/auth"), "/dashboard");
  assert.equal(getPostLoginRedirect("/login"), "/dashboard");
});

test("post-login redirect allows safe in-app targets", () => {
  assert.equal(getPostLoginRedirect("/pets/abc123"), "/pets/abc123");
  assert.equal(getPostLoginRedirect("/dashboard/listings?tab=drafts"), "/dashboard/listings?tab=drafts");
});
