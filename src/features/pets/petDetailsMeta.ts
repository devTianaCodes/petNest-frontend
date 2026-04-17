import type { PetListing } from "../../types/pets";

export function getPetGalleryImages(pet: Pick<PetListing, "images" | "name">) {
  if (pet.images.length) {
    return pet.images;
  }

  return [
    {
      id: "placeholder",
      imageUrl: "https://placehold.co/900x700?text=PetNest",
      sortOrder: 0
    }
  ];
}

export function getPetShareLinks(pathname: string, title: string) {
  const href = typeof window === "undefined" ? pathname : `${window.location.origin}${pathname}`;
  const encodedUrl = encodeURIComponent(href);
  const encodedTitle = encodeURIComponent(title);

  return {
    copyUrl: href,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  };
}
