export type ListingStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "PUBLISHED"
  | "REJECTED"
  | "ADOPTED"
  | "ARCHIVED";

export type PetImage = {
  id: string;
  imageUrl: string;
  sortOrder: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PetListing = {
  id: string;
  name: string;
  description: string;
  ageLabel: string;
  ageValue?: number | null;
  ageUnit?: "WEEKS" | "MONTHS" | "YEARS" | null;
  sex: "MALE" | "FEMALE" | "UNKNOWN";
  size: "SMALL" | "MEDIUM" | "LARGE" | "UNKNOWN";
  breedPrimary?: string | null;
  breedSecondary?: string | null;
  isMixedBreed?: boolean | null;
  energyLevel?: "LOW" | "MEDIUM" | "HIGH" | null;
  houseTrained?: boolean | null;
  spayedNeutered?: boolean | null;
  vaccinated?: boolean | null;
  city: string;
  state: string;
  status: ListingStatus;
  goodWithKids?: boolean | null;
  goodWithDogs?: boolean | null;
  goodWithCats?: boolean | null;
  contactEmail?: string;
  contactPhone?: string | null;
  category: Category;
  images: PetImage[];
  owner?: {
    id: string;
    fullName: string;
    city?: string | null;
    state?: string | null;
  };
  rejectionReason?: string | null;
  rescueStory?: string | null;
  healthNotes?: string | null;
};

export type PetListResponse = {
  items: PetListing[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};
