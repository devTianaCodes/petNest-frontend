import { Link } from "react-router-dom";
import type { PetListing } from "../types/pets";
import { buildPetDetailsPath } from "../features/pets/petPaths";
import { FavoriteButton } from "./FavoriteButton";
import { StatusBadge } from "./StatusBadge";
import { getPetCardMeta } from "./petCardMeta";

export function PetCard({ pet, showStatus = false }: { pet: PetListing; showStatus?: boolean }) {
  const { coverImage, hoverImage, detailLabel } = getPetCardMeta(pet);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative h-56 w-full overflow-hidden bg-stone-100">
        <div className="absolute right-4 top-4 z-10">
          <FavoriteButton listingId={pet.id} />
        </div>
        <img
          src={coverImage}
          alt={pet.name}
          className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
            hoverImage ? "opacity-100 group-hover:opacity-0" : ""
          }`}
        />
        {hoverImage ? (
          <img
            src={hoverImage}
            alt={`${pet.name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
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
        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <p className="text-sm text-stone-500">{detailLabel}</p>
          <Link to={buildPetDetailsPath(pet)} className="rounded-full bg-fern px-5 py-2 text-sm font-medium text-white">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
