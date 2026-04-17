import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteSavedSearch, getSavedSearches } from "../api/savedSearches";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { createSavedSearchLink, getSavedSearchSummary } from "../features/saved-searches/savedSearchMeta";

export function SavedSearchesPage() {
  const queryClient = useQueryClient();
  const savedSearchesQuery = useQuery({
    queryKey: ["saved-searches"],
    queryFn: getSavedSearches
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSavedSearch,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
    }
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Saved searches</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Reuse your favorite browse filters</h1>
        <p className="mt-4 text-stone-700">Save useful filter combinations, then reopen them from your dashboard in one click.</p>
      </section>

      {savedSearchesQuery.isError ? (
        <QueryStateNotice
          title="Saved searches could not load"
          message={(savedSearchesQuery.error as Error).message || "Your saved searches are unavailable right now."}
          tone="error"
        />
      ) : savedSearchesQuery.isLoading ? (
        <QueryStateNotice title="Loading saved searches" message="Fetching your saved browse filters." />
      ) : savedSearchesQuery.data?.items.length ? (
        <div className="grid gap-4">
          {savedSearchesQuery.data.items.map((search) => (
            <article key={search.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-ink">{search.label}</h2>
                  <p className="text-sm leading-6 text-stone-700">{getSavedSearchSummary(search)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to={createSavedSearchLink(search)} className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
                    Open search
                  </Link>
                  <button
                    type="button"
                    disabled={deleteMutation.isPending && deleteMutation.variables === search.id}
                    onClick={() => deleteMutation.mutate(search.id)}
                    className="rounded-full border border-stone-200 px-5 py-3 text-sm font-medium text-ink disabled:opacity-40"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === search.id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <QueryStateNotice
          title="No saved searches yet"
          message="Save a useful browse filter from the adoptable pets page to reuse it later."
        />
      )}
    </div>
  );
}
