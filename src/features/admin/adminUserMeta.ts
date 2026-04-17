import type { AuthUser } from "../../types/auth";

export function getAdminUserMeta(user: Pick<AuthUser, "city" | "state" | "createdAt">) {
  const location = [user.city, user.state].filter(Boolean).join(", ") || "Location not provided";
  const joinedLabel = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Unknown";

  return {
    location,
    joinedLabel
  };
}
