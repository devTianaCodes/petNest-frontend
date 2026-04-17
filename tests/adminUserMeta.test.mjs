import assert from "node:assert/strict";
import test from "node:test";
import { getAdminUserMeta } from "../dist-tests/src/features/admin/adminUserMeta.js";

test("admin user meta formats location and join date", () => {
  const result = getAdminUserMeta({
    city: "Boston",
    state: "MA",
    createdAt: "2024-01-15T00:00:00.000Z"
  });

  assert.equal(result.location, "Boston, MA");
  assert.match(result.joinedLabel, /2024/);
});

test("admin user meta falls back when data is missing", () => {
  const result = getAdminUserMeta({
    city: null,
    state: null,
    createdAt: undefined
  });

  assert.equal(result.location, "Location not provided");
  assert.equal(result.joinedLabel, "Unknown");
});
