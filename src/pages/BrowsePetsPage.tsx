import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories";
import { getPets } from "../api/pets";
import { PageHeader } from "../components/PageHeader";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function BrowsePetsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const params = useMemo(() => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    if (category) next.set("category", category);
    return next;
  }, [search, category]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const petsQuery = useQuery({
    queryKey: ["pets", search, category],
    queryFn: () => getPets(params)
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Browse"
        title="Adoptable pets"
        description="Search current published listings from verified users and rescue-focused owners."
      />

      <section className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_240px]">
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
    </div>
  );
}
