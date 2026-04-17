import type { PetListing } from "../../types/pets";

export function getPendingListingMeta(listing: Pick<PetListing, "breedPrimary" | "breedSecondary" | "ageLabel" | "images" | "healthNotes" | "rescueStory">) {
  const breedLabel = [listing.breedPrimary, listing.breedSecondary].filter(Boolean).join(" / ") || "Unknown breed";
  const coverImage = listing.images[0]?.imageUrl ?? "https://placehold.co/320x220?text=PetNest";
  const notes = [listing.rescueStory, listing.healthNotes].filter(Boolean);

  return {
    breedLabel,
    coverImage,
    noteCount: notes.length,
    hasExtraNotes: notes.length > 0,
    summary: `${listing.ageLabel} • ${breedLabel}`
  };
}
