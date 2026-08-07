import { useState } from "react";
import { Link } from "react-router-dom";
import type { PetListing } from "../types/pets";
import { getOptimizedPetImageUrl } from "../features/pets/petImageUrl";
import { buildPetDetailsPath } from "../features/pets/petPaths";
import { FavoriteButton } from "./FavoriteButton";
import { StatusBadge } from "./StatusBadge";
import { getPetCardMeta } from "./petCardMeta";

type PetCardProps = {
  pet: PetListing;
  showStatus?: boolean;
  priority?: boolean;
};

export function PetCard({ pet, showStatus = false, priority = false }: PetCardProps) {
  const { coverImage, hoverImage, detailLabel } = getPetCardMeta(pet);
  const optimizedCoverImage = getOptimizedPetImageUrl(coverImage, 720);
  const optimizedHoverImage = hoverImage ? getOptimizedPetImageUrl(hoverImage, 720) : undefined;
  const [hoverImageRequested, setHoverImageRequested] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

  function requestHoverImage() {
    if (optimizedHoverImage) setHoverImageRequested(true);
  }

  function handlePointerEnter(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse") requestHoverImage();
  }

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5 sm:rounded-[28px]"
      onPointerEnter={handlePointerEnter}
      onFocusCapture={requestHoverImage}
    >
      <div className="relative h-52 w-full overflow-hidden bg-stone-100 sm:h-56">
        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <FavoriteButton listingId={pet.id} />
        </div>
        <img
          src={optimizedCoverImage}
          alt={pet.name}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
            hoverImageLoaded ? "opacity-100 group-hover:opacity-0 group-focus-within:opacity-0" : ""
          }`}
        />
        {optimizedHoverImage && hoverImageRequested ? (
          <img
            src={optimizedHoverImage}
            alt={`${pet.name} alternate view`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            onLoad={() => setHoverImageLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 ${
              hoverImageLoaded ? "group-hover:opacity-100 group-focus-within:opacity-100" : ""
            }`}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fern">{pet.category.name}</p>
            <h3 className="text-xl font-semibold text-ink">{pet.name}</h3>
            <p className="text-sm text-stone-600">
              {pet.city}, {pet.state}
            </p>
          </div>
          {showStatus ? <StatusBadge status={pet.status} /> : null}
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{pet.description}</p>
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 pt-4">
          <p className="min-w-0 pr-1 text-sm leading-6 text-stone-500">{detailLabel}</p>
          <Link
            to={buildPetDetailsPath(pet)}
            className="inline-flex min-w-[5.5rem] shrink-0 justify-center rounded-full bg-fern px-5 py-2 text-sm font-medium text-white"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
