import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function FavoritesPage() {
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Saved favorites</h1>
        <p className="mt-2 text-stone-700">Keep the animals you want to revisit in one place.</p>
      </div>

      {favoritesQuery.isError ? (
        <QueryStateNotice
          title="Favorites could not load"
          message={(favoritesQuery.error as Error).message || "Saved favorites could not be fetched."}
          tone="error"
        />
      ) : favoritesQuery.isLoading ? (
        <QueryStateNotice title="Loading favorites" message="Fetching your saved animals." />
      ) : favoritesQuery.data?.items.length ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favoritesQuery.data.items.map((item) => (
            <PetCard key={item.id} pet={item.listing} />
          ))}
        </section>
      ) : (
        <QueryStateNotice
          title="No favorites yet"
          message="Save animals from browse or detail pages to keep them here."
        />
      )}
    </div>
  );
}
