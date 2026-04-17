import type { ListingReport } from "../../types/reports";

export function getReportMeta(report: ListingReport) {
  const listingLocation = [report.listing.city, report.listing.state].filter(Boolean).join(", ");
  const reporterLocation = [report.reporter.city, report.reporter.state].filter(Boolean).join(", ");

  return {
    listingLocation: listingLocation || "Location unavailable",
    reporterLocation: reporterLocation || "Location unavailable",
    coverImage: report.listing.images[0]?.imageUrl ?? "https://placehold.co/320x220?text=PetNest"
  };
}
