import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyListings, submitListing } from "../api/pets";
import { PetCard } from "../components/PetCard";

export function MyListingsPage() {
  const listingsQuery = useQuery({
    queryKey: ["my-listings"],
    queryFn: getMyListings
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-ink">My listings</h1>
          <p className="mt-2 text-stone-700">Draft, pending, and published listings all stay in one place.</p>
        </div>
        <Link to="/dashboard/listings/new" className="rounded-full bg-fern px-5 py-3 text-sm font-medium text-white">
          New listing
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {listingsQuery.data?.items.map((listing) => (
          <div key={listing.id} className="space-y-4">
            <PetCard pet={listing} showStatus />
            {listing.status === "DRAFT" || listing.status === "REJECTED" ? (
              <button
                type="button"
                className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
                onClick={() => void submitListing(listing.id, "submit")}
              >
                Submit for approval
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
