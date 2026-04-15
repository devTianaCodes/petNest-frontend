import { Link } from "react-router-dom";
import type { PetListing } from "../types/pets";
import { StatusBadge } from "./StatusBadge";

export function PetCard({ pet, showStatus = false }: { pet: PetListing; showStatus?: boolean }) {
  const coverImage = pet.images[0]?.imageUrl ?? "https://placehold.co/640x420?text=PetNest";

  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
      <img src={coverImage} alt={pet.name} className="h-56 w-full object-cover" />
      <div className="space-y-4 p-5">
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
        <p className="line-clamp-3 text-sm leading-6 text-stone-700">{pet.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {pet.ageLabel} • {pet.sex.toLowerCase()}
          </p>
          <Link to={`/pets/${pet.id}`} className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
