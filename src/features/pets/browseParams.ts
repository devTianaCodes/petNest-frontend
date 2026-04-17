const filterKeys = ["search", "category", "sex", "size", "city", "state"] as const;

export type BrowseFilters = Record<(typeof filterKeys)[number], string> & {
  page: number;
};

export function getBrowseFilters(searchParams: URLSearchParams): BrowseFilters {
  const pageValue = Number(searchParams.get("page"));

  return {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    sex: searchParams.get("sex") ?? "",
    size: searchParams.get("size") ?? "",
    city: searchParams.get("city") ?? "",
    state: searchParams.get("state") ?? "",
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1
  };
}

export function createBrowseSearchParams(filters: BrowseFilters) {
  const next = new URLSearchParams();

  for (const key of filterKeys) {
    const value = filters[key].trim();
    if (value) {
      next.set(key, value);
    }
  }

  if (filters.page > 1) {
    next.set("page", String(filters.page));
  }

  return next;
}
