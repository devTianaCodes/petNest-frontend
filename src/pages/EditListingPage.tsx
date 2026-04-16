import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../api/categories";
import { deleteListingImage, getPet, updateListing, uploadListingImages } from "../api/pets";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { ListingForm, type ListingFormValues } from "../features/pets/ListingForm";
import { ImageUploader } from "../features/pets/ImageUploader";

export function EditListingPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  const listingQuery = useQuery({
    queryKey: ["pet", id],
    queryFn: () => getPet(id),
    enabled: Boolean(id)
  });

  const saveMutation = useMutation({
    mutationFn: (values: ListingFormValues) => updateListing(id, values),
    onSuccess: async () => {
      setError(null);
      setMessage("Listing updated.");
      await queryClient.invalidateQueries({ queryKey: ["pet", id] });
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (mutationError) => {
      setError((mutationError as Error).message);
    }
  });

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => uploadListingImages(id, files),
    onSuccess: async () => {
      setError(null);
      setMessage("Images uploaded.");
      await queryClient.invalidateQueries({ queryKey: ["pet", id] });
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (mutationError) => {
      setError((mutationError as Error).message);
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => deleteListingImage(id, imageId),
    onSuccess: async () => {
      setError(null);
      setMessage("Image removed.");
      await queryClient.invalidateQueries({ queryKey: ["pet", id] });
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
    onError: (mutationError) => {
      setError((mutationError as Error).message);
    }
  });

  const listing = listingQuery.data?.listing;

  if (categoriesQuery.isError) {
    return (
      <QueryStateNotice
        title="Categories unavailable"
        message={(categoriesQuery.error as Error).message || "The category list could not be loaded for editing."}
        tone="error"
      />
    );
  }

  if (listingQuery.isError) {
    return (
      <QueryStateNotice
        title="Listing unavailable"
        message={(listingQuery.error as Error).message || "The listing could not be loaded for editing."}
        tone="error"
      />
    );
  }

  if (categoriesQuery.isLoading || listingQuery.isLoading || !listing || !categoriesQuery.data) {
    return <QueryStateNotice title="Loading listing" message="Fetching listing details and categories." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Edit listing</h1>
          <p className="mt-2 text-stone-700">Update the pet details, manage images, and return to your listings dashboard.</p>
        </div>
        <Link to="/dashboard/listings" className="rounded-full border border-ink/10 px-5 py-3 text-sm font-medium text-ink">
          Back to listings
        </Link>
      </div>

      <ListingForm
        categories={categoriesQuery.data.categories}
        initialValues={listing}
        onSubmit={async (values) => {
          await saveMutation.mutateAsync(values);
        }}
        isSaving={saveMutation.isPending}
      />

      {message ? (
        <div className="rounded-[28px] bg-sand/60 p-5 text-sm text-stone-800 shadow-sm ring-1 ring-black/5">{message}</div>
      ) : null}
      {error ? (
        <div className="rounded-[28px] bg-rose-50 p-5 text-sm text-rose-900 shadow-sm ring-1 ring-rose-200">{error}</div>
      ) : null}

      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Current images</h2>
            <p className="mt-2 text-stone-700">You can keep up to 3 images on a listing.</p>
          </div>
          <button
            type="button"
            className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
            onClick={() => navigate(`/pets/${id}`)}
          >
            Preview listing
          </button>
        </div>

        {listing.images.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listing.images.map((image) => (
              <article key={image.id} className="overflow-hidden rounded-[24px] border border-stone-200">
                <img src={image.imageUrl} alt={listing.name} className="h-64 w-full object-cover" />
                <div className="p-4">
                  <button
                    type="button"
                    disabled={deleteImageMutation.isPending}
                    className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
                    onClick={() => {
                      setMessage(null);
                      setError(null);
                      deleteImageMutation.mutate(image.id);
                    }}
                  >
                    {deleteImageMutation.isPending && deleteImageMutation.variables === image.id ? "Removing..." : "Remove image"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-stone-700">No images uploaded yet.</p>
        )}
      </section>

      {listing.images.length < 3 ? (
        <ImageUploader
          onUpload={async (files) => {
            setMessage(null);
            setError(null);
            await uploadMutation.mutateAsync(files);
          }}
          isUploading={uploadMutation.isPending}
          maxFiles={3 - listing.images.length}
        />
      ) : (
        <div className="rounded-[28px] bg-white p-6 text-stone-700 shadow-sm ring-1 ring-black/5">
          This listing already has the maximum of 3 images.
        </div>
      )}
    </div>
  );
}
