import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPets } from "../api/pets";
import { PageHeader } from "../components/PageHeader";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";

const PAGE_SIZE = 8;

export function AdoptPage() {
  const [page, setPage] = useState(1);

  const params = useMemo(() => {
    const next = new URLSearchParams();
    next.set("page", String(page));
    next.set("limit", String(PAGE_SIZE));
    return next;
  }, [page]);

  const petsQuery = useQuery({
    queryKey: ["adopt-page", page],
    queryFn: () => getPets(params)
  });

  const total = petsQuery.data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Adopt"
        title="Animals for adoption"
        description="Browse currently published adoption listings."
      />

      {petsQuery.isError ? (
        <QueryStateNotice
          title="Animals could not load"
          message={(petsQuery.error as Error).message || "The backend could not load adoption listings."}
          tone="error"
        />
      ) : petsQuery.isLoading ? (
        <QueryStateNotice title="Loading animals" message="Fetching published adoption listings." />
      ) : petsQuery.data?.items.length ? (
        <>
          <section className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            {petsQuery.data.items.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </section>

          <section className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-sm text-stone-700">
              Page {page} of {totalPages} • {total} animals total
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
        </>
      ) : (
        <QueryStateNotice
          title="No animals available"
          message="There are no published adoption listings to show right now."
        />
      )}
    </div>
  );
}
