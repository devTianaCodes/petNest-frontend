export function getBrowseResultsSummary(total: number, page: number, totalPages: number, hasActiveFilters: boolean) {
  return {
    countLabel: `${total} animal${total === 1 ? "" : "s"} found${hasActiveFilters ? " for the current filters" : ""}.`,
    pageLabel: `Page ${page} of ${totalPages}`,
    filterLabel: hasActiveFilters ? "Filtered results" : "All published listings"
  };
}
