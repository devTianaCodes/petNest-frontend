import type { PetListing } from "./pets";

export type FavoriteItem = {
  id: string;
  createdAt: string;
  listing: PetListing;
};
