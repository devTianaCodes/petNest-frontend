const filterKeys = ["search", "category", "sex", "size", "city", "state"] as const;

export type BrowseSort = "newest" | "oldest" | "name-asc";
export type BrowseView = "grid" | "list";

export type BrowseFilters = Record<(typeof filterKeys)[number], string> & {
  sort: BrowseSort;
  view: BrowseView;
  page: number;
};

export type BrowseFilterChip = {
  key: keyof Pick<BrowseFilters, "search" | "category" | "sex" | "size" | "city" | "state">;
  label: string;
};

export function getBrowseFilters(searchParams: URLSearchParams): BrowseFilters {
  const pageValue = Number(searchParams.get("page"));
  const sortValue = searchParams.get("sort");
  const viewValue = searchParams.get("view");

  return {
    search: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? "",
    sex: searchParams.get("sex") ?? "",
    size: searchParams.get("size") ?? "",
    city: searchParams.get("city") ?? "",
    state: searchParams.get("state") ?? "",
    sort: sortValue === "oldest" || sortValue === "name-asc" ? sortValue : "newest",
    view: viewValue === "list" ? "list" : "grid",
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

  if (filters.sort !== "newest") {
    next.set("sort", filters.sort);
  }

  if (filters.view !== "grid") {
    next.set("view", filters.view);
  }

  if (filters.page > 1) {
    next.set("page", String(filters.page));
  }

  return next;
}

export function getBrowseFilterChips(filters: BrowseFilters): BrowseFilterChip[] {
  return [
    filters.search ? { key: "search", label: `Search: ${filters.search}` } : null,
    filters.category ? { key: "category", label: `Category: ${filters.category}` } : null,
    filters.sex ? { key: "sex", label: `Sex: ${filters.sex.toLowerCase()}` } : null,
    filters.size ? { key: "size", label: `Size: ${filters.size.toLowerCase()}` } : null,
    filters.city ? { key: "city", label: `City: ${filters.city}` } : null,
    filters.state ? { key: "state", label: `State: ${filters.state}` } : null
  ].filter(Boolean) as BrowseFilterChip[];
}
