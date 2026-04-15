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
  sex: "MALE" | "FEMALE" | "UNKNOWN";
  size: "SMALL" | "MEDIUM" | "LARGE" | "UNKNOWN";
  breed?: string | null;
  city: string;
  state: string;
  status: ListingStatus;
  goodWithKids?: boolean | null;
  goodWithPets?: boolean | null;
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
