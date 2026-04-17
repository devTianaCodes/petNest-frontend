import type { AuthUser } from "../../types/auth";

type DashboardLink = {
  to: string;
  title: string;
  description: string;
};

export function getDashboardLinks(user?: Pick<AuthUser, "role" | "isEmailVerified"> | null): DashboardLink[] {
  const links: DashboardLink[] = [
    {
      to: "/dashboard/listings/new",
      title: "New listing",
      description: user?.isEmailVerified
        ? "Start a new adoption post, upload photos, and submit it for review."
        : "Draft a new listing now. You can submit it after verifying your email."
    },
    {
      to: "/dashboard/listings",
      title: "My listings",
      description: "Create, edit, submit, and review status changes on your adoption posts."
    },
    {
      to: "/dashboard/requests/incoming",
      title: "Incoming requests",
      description: "Review adoption requests from interested adopters."
    },
    {
      to: "/dashboard/requests/outgoing",
      title: "Outgoing requests",
      description: "Track the requests you have submitted to other listing owners."
    },
    {
      to: "/dashboard/profile",
      title: "Profile settings",
      description: "Keep your name, city, and contact details up to date."
    }
  ];

  if (user?.role === "ADMIN") {
    links.push({
      to: "/admin/pending",
      title: "Moderation queue",
      description: "Review pending listings and keep the rescue feed trustworthy."
    });
  }

  return links;
}
