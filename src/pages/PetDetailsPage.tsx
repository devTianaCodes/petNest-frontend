import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { createAdoptionRequest } from "../api/adoption-requests";
import { getPet } from "../api/pets";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { getAdoptionRequestFormState } from "../features/adoption/requestState";
import { useAuth } from "../features/auth/AuthContext";

export function PetDetailsPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [housingType, setHousingType] = useState("");
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const queryClient = useQueryClient();
  const petQuery = useQuery({
    queryKey: ["pet", id],
    queryFn: () => getPet(id),
    enabled: Boolean(id)
  });

  const requestMutation = useMutation({
    mutationFn: () =>
      createAdoptionRequest(id, {
        message,
        housingType,
        hasOtherPets,
        hasChildren
      }),
    onSuccess: async () => {
      setMessage("");
      setHousingType("");
      setHasOtherPets(false);
      setHasChildren(false);
      await queryClient.invalidateQueries({ queryKey: ["outgoing-requests"] });
    }
  });

  const pet = petQuery.data?.listing;
  const breedLabel = [pet?.breedPrimary, pet?.breedSecondary].filter(Boolean).join(" / ");
  const requestFormState = getAdoptionRequestFormState({
    userId: user?.id,
    ownerId: pet?.owner?.id,
    listingStatus: pet?.status ?? "PUBLISHED",
    message,
    isSubmitting: requestMutation.isPending
  });

  if (petQuery.isError) {
    return (
      <QueryStateNotice
        title="Listing unavailable"
        message={(petQuery.error as Error).message || "The pet details could not be loaded."}
        tone="error"
      />
    );
  }

  if (!pet) {
    return <QueryStateNotice title="Loading listing" message="Fetching pet details." />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {pet.images.length ? (
            pet.images.map((image) => (
              <img key={image.id} src={image.imageUrl} alt={pet.name} className="h-72 w-full rounded-[28px] object-cover" />
            ))
          ) : (
            <div className="rounded-[28px] bg-white p-10 shadow-sm ring-1 ring-black/5">No images uploaded yet.</div>
          )}
        </div>
        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">{pet.category.name}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">{pet.name}</h1>
          <p className="mt-2 text-stone-600">
            {pet.city}, {pet.state}
          </p>
          <div className="mt-6 grid gap-3 text-sm text-stone-700 md:grid-cols-2">
            <div>Age: {pet.ageLabel}</div>
            <div>Sex: {pet.sex}</div>
            <div>Size: {pet.size}</div>
            <div>Breed: {breedLabel || "Unknown"}</div>
            <div>Energy: {pet.energyLevel || "Unknown"}</div>
            <div>Vaccinated: {pet.vaccinated === null || pet.vaccinated === undefined ? "Unknown" : pet.vaccinated ? "Yes" : "No"}</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Tag label="Good with kids" active={pet.goodWithKids} />
            <Tag label="Good with dogs" active={pet.goodWithDogs} />
            <Tag label="Good with cats" active={pet.goodWithCats} />
            <Tag label="House trained" active={pet.houseTrained} />
            <Tag label="Spayed / neutered" active={pet.spayedNeutered} />
          </div>
          <p className="mt-6 text-base leading-7 text-stone-700">{pet.description}</p>
          {pet.rescueStory ? (
            <div className="mt-6 rounded-3xl bg-sand/55 p-5">
              <h2 className="text-lg font-semibold text-ink">Rescue story</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">{pet.rescueStory}</p>
            </div>
          ) : null}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">Adoption request</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Contact details stay private. Submit a thoughtful message and the listing owner can review it inside PetNest.
          </p>
          {user ? (
            <>
              <input
                className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={housingType}
                onChange={(event) => setHousingType(event.target.value)}
                placeholder="Housing type, e.g. apartment, house with yard"
              />
              <textarea
                className="mt-4 min-h-40 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Explain your home, experience, and why this pet is a fit."
              />
              <p className="mt-2 text-xs text-stone-500">
                {requestFormState.trimmedMessage.length}/20 minimum characters
              </p>
              <div className="mt-4 grid gap-3 text-sm text-stone-700">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={hasOtherPets} onChange={(event) => setHasOtherPets(event.target.checked)} />
                  I already have other pets at home
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={hasChildren} onChange={(event) => setHasChildren(event.target.checked)} />
                  Children live in the home
                </label>
              </div>
              <button
                type="button"
                className="mt-4 rounded-full bg-fern px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
                onClick={() => requestMutation.mutate()}
                disabled={!requestFormState.canSubmit}
              >
                {requestMutation.isPending ? "Sending request..." : "Submit request"}
              </button>
              {!requestFormState.canSubmit ? <p className="mt-3 text-sm text-stone-600">{requestFormState.disabledReason}</p> : null}
              {requestMutation.isError ? (
                <p className="mt-3 text-sm text-rose-700">{(requestMutation.error as Error).message}</p>
              ) : null}
              {requestMutation.isSuccess ? (
                <p className="mt-3 text-sm text-emerald-700">Request sent. Track it from your outgoing requests dashboard.</p>
              ) : null}
            </>
          ) : (
            <p className="mt-4 text-sm text-stone-700">Log in to submit an adoption request.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Tag({ label, active }: { label: string; active?: boolean | null }) {
  if (active === null || active === undefined) {
    return null;
  }

  return (
    <span className={`rounded-full px-4 py-2 ${active ? "bg-fern/15 text-fern" : "bg-stone-200 text-stone-600"}`}>
      {label}
    </span>
  );
}
