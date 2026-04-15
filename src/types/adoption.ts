export type AdoptionRequest = {
  id: string;
  message: string;
  housingType?: string | null;
  hasOtherPets?: boolean | null;
  hasChildren?: boolean | null;
  status: "PENDING" | "CONTACTED" | "APPROVED" | "REJECTED" | "WITHDRAWN";
  createdAt: string;
  listing: {
    id: string;
    name: string;
    city: string;
    state: string;
    images?: { imageUrl: string }[];
    category?: { name: string };
  };
  requester?: {
    fullName: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    state?: string | null;
  };
};
