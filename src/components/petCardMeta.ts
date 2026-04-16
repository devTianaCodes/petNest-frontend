import type { PetListing } from "../types/pets";

export function getPetCardMeta(pet: PetListing) {
  return {
    coverImage: pet.images[0]?.imageUrl ?? "https://placehold.co/640x420?text=PetNest",
    hoverImage: pet.images[1]?.imageUrl,
    breedLabel: [pet.breedPrimary, pet.breedSecondary].filter(Boolean).join(" / "),
    detailLabel: [pet.ageLabel, [pet.breedPrimary, pet.breedSecondary].filter(Boolean).join(" / ") || pet.sex.toLowerCase()].join(" • ")
  };
}
