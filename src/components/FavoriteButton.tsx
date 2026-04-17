import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { addFavorite, getFavorites, removeFavorite } from "../api/favorites";
import { getFavoriteIds } from "../features/favorites/favoritesState";
import { getProtectedRedirect } from "../features/auth/authRedirect";
import { useAuth } from "../features/auth/AuthContext";

export function FavoriteButton({
  listingId,
  className = ""
}: {
  listingId: string;
  className?: string;
}) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(user)
  });

  const favoriteIds = getFavoriteIds(favoritesQuery.data?.items ?? []);
  const isFavorite = favoriteIds.has(listingId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await removeFavorite(listingId);
        return;
      }

      await addFavorite(listingId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }
  });

  const baseClassName = `inline-flex items-center justify-center rounded-full border border-black/10 bg-white/95 px-3 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-fern hover:text-fern ${className}`.trim();

  if (!user) {
    return (
      <Link to={getProtectedRedirect(location.pathname, location.search)} className={baseClassName}>
        ♡ Save
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClassName}
      disabled={mutation.isPending || favoritesQuery.isLoading}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? "..." : isFavorite ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
