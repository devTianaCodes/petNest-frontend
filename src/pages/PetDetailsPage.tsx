import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { createAdoptionRequest } from "../api/adoption-requests";
import { getPet } from "../api/pets";
import { createListingReport } from "../api/reports";
import { FavoriteButton } from "../components/FavoriteButton";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { getAdoptionRequestFormState } from "../features/adoption/requestState";
import { getProtectedRedirect } from "../features/auth/authRedirect";
import { useAuth } from "../features/auth/AuthContext";
import { getPetGalleryImages, getPetShareLinks } from "../features/pets/petDetailsMeta";
import { canSubmitListingReport } from "../features/reports/reportForm";

export function PetDetailsPage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [housingType, setHousingType] = useState("");
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
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
  const reportMutation = useMutation({
    mutationFn: () =>
      createListingReport(id, {
        reason: reportReason.trim(),
        details: reportDetails.trim()
      }),
    onSuccess: () => {
      setReportReason("");
      setReportDetails("");
    }
  });

  const pet = petQuery.data?.listing;
  const breedLabel = [pet?.breedPrimary, pet?.breedSecondary].filter(Boolean).join(" / ");
  const galleryImages = getPetGalleryImages({
    images: pet?.images ?? [],
    name: pet?.name ?? "Pet"
  });
  const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0];
  const shareLinks = getPetShareLinks(location.pathname, pet?.name ?? "PetNest listing");
  const requestFormState = getAdoptionRequestFormState({
    userId: user?.id,
    ownerId: pet?.owner?.id,
    listingStatus: pet?.status ?? "PUBLISHED",
    message,
    isSubmitting: requestMutation.isPending
  });
  const reportFormState = canSubmitListingReport({
    reason: reportReason,
    details: reportDetails,
    isOwner: user?.id === pet?.owner?.id,
    isSubmitting: reportMutation.isPending
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
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="block w-full overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5"
          >
            <img src={selectedImage.imageUrl} alt={pet.name} className="h-[28rem] w-full object-cover" />
          </button>
          <div className="grid gap-4 md:grid-cols-4">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`overflow-hidden rounded-[24px] ring-2 ${
                  selectedImageIndex === index ? "ring-fern" : "ring-black/5"
                }`}
              >
                <img src={image.imageUrl} alt={`${pet.name} view ${index + 1}`} className="h-28 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">{pet.category.name}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-ink">{pet.name}</h1>
            <FavoriteButton listingId={pet.id} />
          </div>
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
          {pet.healthNotes ? (
            <div className="mt-6 rounded-3xl bg-canvas p-5">
              <h2 className="text-lg font-semibold text-ink">Health notes</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">{pet.healthNotes}</p>
            </div>
          ) : null}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">Rescuer info</h2>
          <p className="mt-3 text-sm text-stone-700">
            {pet.owner?.fullName ?? "PetNest rescuer"}
            {pet.owner?.city || pet.owner?.state ? ` • ${[pet.owner?.city, pet.owner?.state].filter(Boolean).join(", ")}` : ""}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Requests stay private inside PetNest until the rescuer reviews your message and decides to respond.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">Share this listing</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(shareLinks.copyUrl);
                setShareMessage("Listing link copied.");
              }}
              className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink"
            >
              Copy link
            </button>
            <a href={shareLinks.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink">
              Share to Facebook
            </a>
            <a href={shareLinks.email} className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink">
              Share by email
            </a>
          </div>
          {shareMessage ? <p className="mt-3 text-sm text-emerald-700">{shareMessage}</p> : null}
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-semibold text-ink">Report this listing</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Flag listings that look fraudulent, unsafe, or clearly misleading. Reports go to the moderation dashboard.
          </p>
          {user ? (
            <>
              <input
                className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                placeholder="Short reason, e.g. scam, duplicate, misleading"
              />
              <textarea
                className="mt-4 min-h-28 w-full rounded-2xl border border-stone-200 px-4 py-3"
                value={reportDetails}
                onChange={(event) => setReportDetails(event.target.value)}
                placeholder="Explain what looks wrong so admins can review it."
              />
              <button
                type="button"
                className="mt-4 rounded-full border border-rose-200 px-5 py-3 text-sm font-medium text-rose-700 disabled:opacity-60"
                onClick={() => reportMutation.mutate()}
                disabled={!reportFormState.canSubmit}
              >
                {reportMutation.isPending ? "Sending report..." : "Submit report"}
              </button>
              {reportMutation.isError ? <p className="mt-3 text-sm text-rose-700">{(reportMutation.error as Error).message}</p> : null}
              {reportMutation.isSuccess ? <p className="mt-3 text-sm text-emerald-700">Report sent to moderators.</p> : null}
              {!reportFormState.canSubmit ? (
                <p className="mt-3 text-sm text-stone-600">
                  {user?.id === pet.owner?.id ? "You cannot report your own listing." : "Add a short reason and a few details first."}
                </p>
              ) : null}
            </>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-stone-700">Log in if you need to flag this listing for moderation.</p>
              <Link
                to={getProtectedRedirect(location.pathname, location.search)}
                className="inline-flex rounded-full border border-ink/10 px-5 py-3 text-sm font-medium text-ink"
              >
                Log in to report
              </Link>
            </div>
          )}
        </div>

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
              {requestMutation.isError ? (
                <p className="mt-3 text-sm text-rose-700">{(requestMutation.error as Error).message}</p>
              ) : null}
              {requestMutation.isSuccess ? (
                <p className="mt-3 text-sm text-emerald-700">Request sent. Track it from your outgoing requests dashboard.</p>
              ) : null}
            </>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-stone-700">Log in to submit an adoption request and keep your contact details private.</p>
              <Link
                to={getProtectedRedirect(location.pathname, location.search)}
                className="inline-flex rounded-full bg-fern px-5 py-3 text-sm font-medium text-white"
              >
                Log in to apply
              </Link>
            </div>
          )}
          {user && !requestFormState.canSubmit ? (
            <div className="mt-4 rounded-3xl bg-stone-100 p-4 text-sm text-stone-700">
              {requestFormState.disabledReason}
            </div>
          ) : null}
        </div>
      </aside>

      {isLightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="relative w-full max-w-5xl rounded-[32px] bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-6 top-6 rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink"
            >
              Close
            </button>
            <img src={selectedImage.imageUrl} alt={pet.name} className="h-[70vh] w-full rounded-[24px] object-cover" />
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden rounded-[20px] ring-2 ${
                    selectedImageIndex === index ? "ring-fern" : "ring-black/5"
                  }`}
                >
                  <img src={image.imageUrl} alt={`${pet.name} thumbnail ${index + 1}`} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
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
