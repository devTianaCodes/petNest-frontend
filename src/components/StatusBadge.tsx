import type { ListingStatus } from "../types/pets";

const statusMap: Record<ListingStatus, string> = {
  DRAFT: "bg-stone-200 text-stone-700",
  PENDING_APPROVAL: "bg-amber-100 text-amber-800",
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  ADOPTED: "bg-sky-100 text-sky-800",
  ARCHIVED: "bg-slate-100 text-slate-700"
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMap[status]}`}>{status}</span>;
}
