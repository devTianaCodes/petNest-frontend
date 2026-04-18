import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../api/categories";
import { getPets } from "../api/pets";
import { createSavedSearch } from "../api/savedSearches";
import { PageHeader } from "../components/PageHeader";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { useAuth } from "../features/auth/AuthContext";
import { createBrowseSearchParams, getBrowseFilterChips, getBrowseFilters } from "../features/pets/browseParams";
import { getBrowseResultsSummary } from "../features/pets/browseSummary";
import { createSavedSearchLabel } from "../features/saved-searches/savedSearchMeta";

const PAGE_SIZE = 12;

export function BrowsePetsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { user } = useAuth();
  const filters = getBrowseFilters(searchParams);
  const { search, category, sex, size, city, state, sort, view, page } = filters;

  const params = useMemo(() => {
    const next = createBrowseSearchParams(filters);
    next.set("limit", String(PAGE_SIZE));
    return next;
  }, [filters]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const petsQuery = useQuery({
    queryKey: ["pets", search, category, sex, size, city, state, sort, page],
    queryFn: () => getPets(params)
  });

  const total = petsQuery.data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters = Boolean(search || category || sex || size || city || state);
  const activeChips = getBrowseFilterChips(filters);
  const summary = getBrowseResultsSummary(total, page, totalPages, hasActiveFilters);
  const saveSearchMutation = useMutation({
    mutationFn: () =>
      createSavedSearch({
        label: createSavedSearchLabel(filters),
        queryString: createBrowseSearchParams({ ...filters, page: 1 }).toString()
      }),
    onSuccess: async () => {
      setSaveError(null);
      setSaveMessage("Current filters saved to your dashboard.");
      await queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
    },
    onError: (error) => {
      setSaveMessage(null);
      setSaveError((error as Error).message);
    }
  });

  function updateFilters(nextValues: Partial<ReturnType<typeof getBrowseFilters>>, resetPage = false) {
    setSearchParams(
      createBrowseSearchParams({
        ...filters,
        ...nextValues,
        page: resetPage ? 1 : nextValues.page ?? filters.page
      })
    );
  }

  function clearFilters() {
    setSearchParams(
      createBrowseSearchParams({
        search: "",
        category: "",
        sex: "",
        size: "",
        city: "",
        state: "",
        sort,
        view,
        page: 1
      })
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Browse"
        title="Adoptable pets"
        description="Search current published listings from verified users and rescue-focused owners."
      />
      <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <aside className="space-y-5 xl:sticky xl:top-28">
          <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Filters</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Narrow the match</h2>
              </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-ink"
                >
                  Clear all
                </button>
              ) : null}
            </div>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-ink">Search</span>
                <input
                  placeholder="Name, breed, rescue story"
                  value={search}
                  onChange={(event) => updateFilters({ search: event.target.value }, true)}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Category</span>
                <select
                  value={category}
                  onChange={(event) => updateFilters({ category: event.target.value }, true)}
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  disabled={categoriesQuery.isLoading || categoriesQuery.isError}
                >
                  <option value="">All categories</option>
                  {categoriesQuery.data?.categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <label className="block">
                  <span className="text-sm font-medium text-ink">Sex</span>
                  <select
                    value={sex}
                    onChange={(event) => updateFilters({ sex: event.target.value }, true)}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  >
                    <option value="">Any sex</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Size</span>
                  <select
                    value={size}
                    onChange={(event) => updateFilters({ size: event.target.value }, true)}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  >
                    <option value="">Any size</option>
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <label className="block">
                  <span className="text-sm font-medium text-ink">City</span>
                  <input
                    placeholder="City"
                    value={city}
                    onChange={(event) => updateFilters({ city: event.target.value }, true)}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">State</span>
                  <input
                    placeholder="State"
                    value={state}
                    onChange={(event) => updateFilters({ state: event.target.value }, true)}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] bg-ink p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">View controls</p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-white">Sort</span>
                <select
                  value={sort}
                  onChange={(event) => updateFilters({ sort: event.target.value as typeof sort }, true)}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white"
                >
                  <option value="newest" className="text-ink">Newest first</option>
                  <option value="oldest" className="text-ink">Oldest first</option>
                  <option value="name-asc" className="text-ink">Name A-Z</option>
                </select>
              </label>
              <div>
                <span className="text-sm font-medium text-white">Layout</span>
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/10 p-2">
                  {[
                    ["grid", "Grid"],
                    ["list", "List"]
                  ].map(([nextView, label]) => (
                    <button
                      key={nextView}
                      type="button"
                      onClick={() => updateFilters({ view: nextView as typeof view })}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        view === nextView ? "bg-white text-ink" : "text-white/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">{summary.filterLabel}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{summary.countLabel}</h2>
                <p className="mt-2 text-sm text-stone-500">{summary.pageLabel}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSaveMessage(null);
                      setSaveError(null);
                      saveSearchMutation.mutate();
                    }}
                    disabled={saveSearchMutation.isPending}
                    className="rounded-full bg-fern px-5 py-3 text-sm font-medium text-white disabled:opacity-40"
                  >
                    {saveSearchMutation.isPending ? "Saving..." : "Save this search"}
                  </button>
                ) : null}
                <span className="rounded-full bg-sand px-4 py-2 text-sm font-medium text-ink">
                  {view === "grid" ? "Grid view" : "List view"}
                </span>
              </div>
            </div>
            {saveMessage ? <p className="mt-4 text-sm text-emerald-700">{saveMessage}</p> : null}
            {saveError ? <p className="mt-4 text-sm text-rose-700">{saveError}</p> : null}
            {activeChips.length ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => updateFilters({ [chip.key]: "" }, true)}
                    className="rounded-full bg-fern/10 px-4 py-2 text-sm font-medium text-fern"
                  >
                    {chip.label} ×
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-stone-600">No filters applied. You are seeing every published adoption listing.</p>
            )}
          </section>

          <section className={view === "list" ? "grid gap-6" : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"}>
            {categoriesQuery.isError ? (
              <QueryStateNotice
                title="Categories could not load"
                message={(categoriesQuery.error as Error).message || "The backend could not load pet categories."}
                tone="error"
              />
            ) : petsQuery.isError ? (
              <QueryStateNotice
                title="Pets could not load"
                message={(petsQuery.error as Error).message || "The backend could not load pet listings."}
                tone="error"
              />
            ) : categoriesQuery.isLoading || petsQuery.isLoading ? (
              <QueryStateNotice
                title="Loading pets"
                message="Fetching categories and published listings."
              />
            ) : petsQuery.data?.items.length ? (
              petsQuery.data.items.map((pet) => <PetCard key={pet.id} pet={pet} />)
            ) : (
              <QueryStateNotice
                title="No animals to show yet"
                message="There are no published listings matching the current filters. If this is a fresh database, run the seed data so demo animals appear here."
              />
            )}
          </section>

          {petsQuery.data?.items.length ? (
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-sm text-stone-700">{summary.pageLabel}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
                  disabled={page === 1}
                  className="rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-ink disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => updateFilters({ page: Math.min(totalPages, page + 1) })}
                  disabled={page >= totalPages}
                  className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}
