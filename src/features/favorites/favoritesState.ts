import type { FavoriteItem } from "../../types/favorites";

export function getFavoriteIds(items: FavoriteItem[]) {
  return new Set(items.map((item) => item.listing.id));
}
