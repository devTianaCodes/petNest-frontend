import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories";
import { getPets } from "../api/pets";
import { PageHeader } from "../components/PageHeader";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";

const PAGE_SIZE = 12;

export function BrowsePetsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sex, setSex] = useState("");
  const [size, setSize] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category, sex, size, city, state]);

  const params = useMemo(() => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    if (category) next.set("category", category);
    if (sex) next.set("sex", sex);
    if (size) next.set("size", size);
    if (city) next.set("city", city);
    if (state) next.set("state", state);
    next.set("page", String(page));
    next.set("limit", String(PAGE_SIZE));
    return next;
  }, [search, category, sex, size, city, state, page]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const petsQuery = useQuery({
    queryKey: ["pets", search, category, sex, size, city, state, page],
    queryFn: () => getPets(params)
  });

  const total = petsQuery.data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters = Boolean(search || category || sex || size || city || state);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setSex("");
    setSize("");
    setCity("");
    setState("");
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Browse"
        title="Adoptable pets"
        description="Search current published listings from verified users and rescue-focused owners."
      />

      <section className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:grid-cols-2 xl:grid-cols-3">
        <input
          placeholder="Search by name, breed, or description"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="rounded-2xl border border-stone-200 px-4 py-3"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-2xl border border-stone-200 px-4 py-3"
          disabled={categoriesQuery.isLoading || categoriesQuery.isError}
        >
          <option value="">All categories</option>
          {categoriesQuery.data?.categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={sex}
          onChange={(event) => setSex(event.target.value)}
          className="rounded-2xl border border-stone-200 px-4 py-3"
        >
          <option value="">Any sex</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="UNKNOWN">Unknown</option>
        </select>
        <select
          value={size}
          onChange={(event) => setSize(event.target.value)}
          className="rounded-2xl border border-stone-200 px-4 py-3"
        >
          <option value="">Any size</option>
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
          <option value="UNKNOWN">Unknown</option>
        </select>
        <input
          placeholder="City"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="rounded-2xl border border-stone-200 px-4 py-3"
        />
        <input
          placeholder="State"
          value={state}
          onChange={(event) => setState(event.target.value)}
          className="rounded-2xl border border-stone-200 px-4 py-3"
        />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
        <p className="text-sm text-stone-700">
          {total} animals found{hasActiveFilters ? " for the current filters" : ""}.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-ink"
            >
              Clear filters
            </button>
          ) : null}
          <span className="text-sm text-stone-500">
            Page {page} of {totalPages}
          </span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          <p className="text-sm text-stone-700">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-ink disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
