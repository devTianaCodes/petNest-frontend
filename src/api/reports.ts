import type { ListingReport, ListingReportStatus } from "../types/reports";
import { apiRequest } from "./client";

export function createListingReport(listingId: string, payload: { reason: string; details?: string }) {
  return apiRequest<{ report: { id: string } }>(`/reports/pets/${listingId}`, {
    method: "POST",
    body: payload
  });
}

export function getReports() {
  return apiRequest<{ items: ListingReport[] }>("/admin/reports");
}

export function updateReportStatus(id: string, status: Exclude<ListingReportStatus, "OPEN">) {
  return apiRequest<{ report: { id: string; status: ListingReportStatus } }>(`/admin/reports/${id}/status`, {
    method: "PATCH",
    body: { status }
  });
}
