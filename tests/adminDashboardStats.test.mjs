import assert from "node:assert/strict";
import test from "node:test";
import { getAdminDashboardStats } from "../dist-tests/src/features/admin/adminDashboardStats.js";

test("admin dashboard stats summarize pending, total, verified, and suspended users", () => {
  const result = getAdminDashboardStats({
    pendingListings: [{ id: "listing_1" }, { id: "listing_2" }],
    users: [
      { id: "1", status: "ACTIVE", isEmailVerified: true },
      { id: "2", status: "SUSPENDED", isEmailVerified: false },
      { id: "3", status: "ACTIVE", isEmailVerified: true }
    ]
  });

  assert.deepEqual(result, {
    pendingListings: 2,
    totalUsers: 3,
    suspendedUsers: 1,
    verifiedUsers: 2
  });
});
