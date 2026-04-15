import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { createAdoptionRequest } from "../api/adoption-requests";
import { getPet } from "../api/pets";
import { useAuth } from "../features/auth/AuthContext";

export function PetDetailsPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const petQuery = useQuery({
    queryKey: ["pet", id],
    queryFn: () => getPet(id),
    enabled: Boolean(id)
  });

  const requestMutation = useMutation({
    mutationFn: () => createAdoptionRequest(id, { message })
  });

  const pet = petQuery.data?.listing;

  if (!pet) {
    return <div className="rounded-[28px] bg-white p-10 shadow-sm ring-1 ring-black/5">Loading listing...</div>;
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
            <div>Breed: {pet.breed || "Unknown"}</div>
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
              <textarea
                className="mt-4 min-h-40 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Explain your home, experience, and why this pet is a fit."
              />
              <button
                type="button"
                className="mt-4 rounded-full bg-fern px-5 py-3 text-sm font-medium text-white"
                onClick={() => requestMutation.mutate()}
              >
                Submit request
              </button>
              {requestMutation.isError ? (
                <p className="mt-3 text-sm text-rose-700">{(requestMutation.error as Error).message}</p>
              ) : null}
              {requestMutation.isSuccess ? <p className="mt-3 text-sm text-emerald-700">Request sent.</p> : null}
            </>
          ) : (
            <p className="mt-4 text-sm text-stone-700">Log in to submit an adoption request.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
