import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories";
import { createListing, uploadListingImages } from "../api/pets";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { ImageUploader } from "../features/pets/ImageUploader";
import { ListingForm, type ListingFormValues } from "../features/pets/ListingForm";

export function CreateListingPage() {
  const navigate = useNavigate();
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });
  const [listingId, setListingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(values: ListingFormValues) {
    setIsSaving(true);
    try {
      const response = await createListing(values);
      setListingId(response.listing.id);
      setMessage("Listing saved. Upload images next, then submit it from your listings dashboard.");
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

      {listingId ? (
        <ImageUploader
          onUpload={async (files) => {
            await uploadListingImages(listingId, files);
            navigate("/dashboard/listings");
          }}
        />
      ) : (
        <div className="rounded-[28px] bg-white p-6 text-sm text-stone-700 shadow-sm ring-1 ring-black/5">
          Save the listing first to unlock image uploads.
        </div>
      )}
    </div>
  );
}
