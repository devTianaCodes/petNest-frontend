import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../api/categories";
import { createListing, submitListing, uploadListingImages } from "../api/pets";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { useAuth } from "../features/auth/AuthContext";
import { getCreateListingProgress, getCreateListingSubmitState } from "../features/pets/createListingFlow";
import { ImageUploader } from "../features/pets/ImageUploader";
import { ListingForm, type ListingFormValues } from "../features/pets/ListingForm";

export function CreateListingPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });
  const [listingId, setListingId] = useState<string | null>(null);
  const [hasUploadedImages, setHasUploadedImages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const progress = getCreateListingProgress({
    hasListingId: Boolean(listingId),
    hasUploadedImages
  });

  const submitMutation = useMutation({
    mutationFn: () => submitListing(listingId!, "submit"),
    onSuccess: async () => {
      setError(null);
      setMessage("Listing submitted for approval. Track its moderation status from My listings.");
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (submitError) => {
      setError((submitError as Error).message);
    }
  });
  const submitState = getCreateListingSubmitState({
    hasListingId: Boolean(listingId),
    hasUploadedImages,
    isEmailVerified: Boolean(user?.isEmailVerified),
    isSubmitting: submitMutation.isPending
  });

  async function handleSubmit(values: ListingFormValues) {
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await createListing(values);
      setListingId(response.listing.id);
      setHasUploadedImages(false);
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      setMessage("Listing saved. Upload images next, then submit it from your listings dashboard.");
    } catch (saveError) {
      setError((saveError as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Create listing</h1>
        <p className="mt-2 text-stone-700">Save the pet details first, then upload up to three photos.</p>
      </div>

      <section className="rounded-[28px] bg-sand/55 p-6 shadow-sm ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">{progress.title}</p>
        <p className="mt-2 text-sm leading-6 text-stone-700">{progress.description}</p>
        {listingId ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={`/dashboard/listings/${listingId}/edit`} className="rounded-full border border-ink/10 px-5 py-3 text-sm font-medium text-ink">
              Continue editing
            </Link>
            <Link to="/dashboard/listings" className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
              Open my listings
            </Link>
            <button
              type="button"
              disabled={!submitState.canSubmit}
              className="rounded-full bg-fern px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
              onClick={() => {
                setMessage(null);
                setError(null);
                submitMutation.mutate();
              }}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit for approval"}
            </button>
          </div>
        ) : null}
        {listingId ? <p className="mt-4 text-sm text-stone-700">{submitState.description}</p> : null}
      </section>

      {categoriesQuery.isError ? (
        <QueryStateNotice
          title="Categories unavailable"
          message={(categoriesQuery.error as Error).message || "The backend could not load categories for the listing form."}
          tone="error"
        />
      ) : categoriesQuery.isLoading ? (
        <QueryStateNotice title="Loading categories" message="Preparing the listing form." />
      ) : categoriesQuery.data?.categories.length ? (
        <ListingForm categories={categoriesQuery.data.categories} onSubmit={handleSubmit} isSaving={isSaving} />
      ) : (
        <QueryStateNotice
          title="No categories found"
          message="Your database has no pet categories yet. Seed the backend data first."
          tone="error"
        />
      )}

      {message ? (
        <div className="rounded-[28px] bg-sand/60 p-5 text-sm text-stone-800 shadow-sm ring-1 ring-black/5">{message}</div>
      ) : null}
      {error ? (
        <div className="rounded-[28px] bg-rose-50 p-5 text-sm text-rose-900 shadow-sm ring-1 ring-rose-200">{error}</div>
      ) : null}

      {listingId ? (
        <ImageUploader
          onUpload={async (files) => {
            setIsUploading(true);
            setError(null);
            setMessage(null);
            try {
              await uploadListingImages(listingId, files);
              await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
              setHasUploadedImages(true);
              setMessage("Images uploaded. Review the draft, then submit it from My listings when you are ready.");
            } catch (uploadError) {
              setError((uploadError as Error).message);
            } finally {
              setIsUploading(false);
            }
          }}
          isUploading={isUploading}
        />
      ) : (
        <div className="rounded-[28px] bg-white p-6 text-sm text-stone-700 shadow-sm ring-1 ring-black/5">
          Save the listing first to unlock image uploads.
        </div>
      )}
    </div>
  );
}
