import type { PetListing } from "./pets";

export type ListingReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export type ListingReport = {
  id: string;
  reason: string;
  details?: string | null;
  status: ListingReportStatus;
  createdAt: string;
  reviewedAt?: string | null;
  listing: PetListing;
  reporter: {
    id: string;
    fullName: string;
    email: string;
    city?: string | null;
    state?: string | null;
  };
}
