import type { ListingStatus, PetListing } from "../../types/pets";

type ListingStatusMeta = {
  title: string;
  description: string;
};

const listingStatusMetaMap: Record<ListingStatus, ListingStatusMeta> = {
  DRAFT: {
    title: "Draft",
    description: "Not public yet. Finish editing, upload images, then submit it for admin review."
  },
  PENDING_APPROVAL: {
    title: "Pending approval",
    description: "Waiting for admin review. You can still open the listing to review its details."
  },
  PUBLISHED: {
    title: "Published",
    description: "Live on PetNest. Adopters can now send requests from the public listing."
  },
  REJECTED: {
    title: "Needs changes",
    description: "Update the listing details, fix the review notes, then submit it again."
  },
  ADOPTED: {
    title: "Adopted",
    description: "Placement completed. The public listing is no longer accepting new requests."
  },
  ARCHIVED: {
    title: "Archived",
    description: "This listing is stored for record keeping and is not active anymore."
  }
};

export function getListingStatusMeta(listing: Pick<PetListing, "status" | "rejectionReason">): ListingStatusMeta {
  const base = listingStatusMetaMap[listing.status];

  if (listing.status !== "REJECTED" || !listing.rejectionReason) {
    return base;
  }

  return {
    ...base,
    description: `${base.description} Review note: ${listing.rejectionReason}`
  };
}
