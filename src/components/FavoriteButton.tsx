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

  const buttonClassName = `inline-flex items-center justify-center text-2xl leading-none text-white drop-shadow-sm transition hover:scale-110 hover:text-rose-100 disabled:opacity-70 ${className}`.trim();
  const label = isFavorite ? "Remove from favorites" : "Save to favorites";

  if (!user) {
    return (
      <Link
        to={getProtectedRedirect(location.pathname, location.search)}
        className={buttonClassName}
        aria-label="Log in to save this animal"
        title="Log in to save this animal"
      >
        ♡
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      disabled={mutation.isPending || favoritesQuery.isLoading}
      onClick={() => mutation.mutate()}
      aria-label={label}
      title={label}
    >
      {mutation.isPending ? "…" : isFavorite ? "♥" : "♡"}
    </button>
  );
}
