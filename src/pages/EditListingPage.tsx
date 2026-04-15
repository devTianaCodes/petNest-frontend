import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../api/categories";
import { deleteListingImage, getPet, updateListing, uploadListingImages } from "../api/pets";
import { ListingForm, type ListingFormValues } from "../features/pets/ListingForm";
import { ImageUploader } from "../features/pets/ImageUploader";

export function EditListingPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);

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
      setMessage("Listing updated.");
      await queryClient.invalidateQueries({ queryKey: ["pet", id] });
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    }
  });

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => uploadListingImages(id, files),
    onSuccess: async () => {
      setMessage("Images uploaded.");
      await queryClient.invalidateQueries({ queryKey: ["pet", id] });
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) => deleteListingImage(id, imageId),
    onSuccess: async () => {
      setMessage("Image removed.");
      await queryClient.invalidateQueries({ queryKey: ["pet", id] });
      await queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    }
  });

  const listing = listingQuery.data?.listing;

  if (!listing || !categoriesQuery.data) {
    return <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">Loading listing...</div>;
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
                    className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white"
                    onClick={() => deleteImageMutation.mutate(image.id)}
                  >
                    Remove image
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
            await uploadMutation.mutateAsync(files);
          }}
        />
      ) : (
        <div className="rounded-[28px] bg-white p-6 text-stone-700 shadow-sm ring-1 ring-black/5">
          This listing already has the maximum of 3 images.
        </div>
      )}
    </div>
  );
}
