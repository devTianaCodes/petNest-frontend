import type { PetListing } from "../../types/pets";

function slugifyPetName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildPetDetailsPath(pet: Pick<PetListing, "id" | "name">) {
  const nameSlug = slugifyPetName(pet.name);
  return nameSlug ? `/pets/${pet.id}/${nameSlug}` : `/pets/${pet.id}`;
}
