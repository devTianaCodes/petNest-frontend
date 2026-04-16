import type { AuthUser } from "../../types/auth";
import type { PetListing } from "../../types/pets";

export function getAdminDashboardStats(input: {
  pendingListings: PetListing[];
  users: AuthUser[];
}) {
  const suspendedUsers = input.users.filter((user) => user.status === "SUSPENDED").length;
  const verifiedUsers = input.users.filter((user) => user.isEmailVerified).length;

  return {
    pendingListings: input.pendingListings.length,
    totalUsers: input.users.length,
    suspendedUsers,
    verifiedUsers
  };
}
