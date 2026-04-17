import type { AdoptionRequest } from "../../types/adoption";

export function formatRequestBoolean(value?: boolean | null) {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  return value ? "Yes" : "No";
}

export function formatRequestStatus(status: AdoptionRequest["status"]) {
  return status.replace(/_/g, " ").toLowerCase();
}

export function canWithdrawRequest(status: AdoptionRequest["status"]) {
  return status === "PENDING" || status === "CONTACTED";
}

export function canOwnerUpdateRequest(status: AdoptionRequest["status"], nextStatus: "CONTACTED" | "APPROVED" | "REJECTED") {
  if (status === "APPROVED" || status === "REJECTED" || status === "WITHDRAWN") {
    return false;
  }

  if (nextStatus === "CONTACTED") {
    return status === "PENDING";
  }

  return status === "PENDING" || status === "CONTACTED";
}

export function getAdoptionRequestFormState(input: {
  userId?: string;
  ownerId?: string;
  listingStatus: string;
  message: string;
  isSubmitting: boolean;
}) {
  const trimmedMessage = input.message.trim();
  const isOwner = Boolean(input.userId && input.ownerId && input.userId === input.ownerId);
  const isPublished = input.listingStatus === "PUBLISHED";
  const canSubmit = Boolean(input.userId) && !isOwner && isPublished && trimmedMessage.length >= 20 && !input.isSubmitting;

  let disabledReason = "";

  if (!input.userId) {
    disabledReason = "Log in to submit an adoption request.";
  } else if (isOwner) {
    disabledReason = "You cannot submit a request for your own listing.";
  } else if (!isPublished) {
    disabledReason = getClosedListingReason(input.listingStatus);
  } else if (trimmedMessage.length < 20) {
    disabledReason = "Write at least 20 characters so the owner can review your request.";
  }

  return {
    trimmedMessage,
    isOwner,
    canSubmit,
    disabledReason
  };
}

export function getOutgoingRequestProgress(status: AdoptionRequest["status"]) {
  if (status === "PENDING") {
    return {
      title: "Sent and waiting for review",
      description: "The rescuer can read your request privately and decide whether to contact you.",
      toneClassName: "bg-sand/60 text-ink"
    };
  }

  if (status === "CONTACTED") {
    return {
      title: "Rescuer has responded",
      description: "Keep an eye on your contact details and dashboard for the next decision.",
      toneClassName: "bg-fern/15 text-fern"
    };
  }

  if (status === "APPROVED") {
    return {
      title: "Request approved",
      description: "This adoption request has been approved. Coordinate the next steps with the rescuer.",
      toneClassName: "bg-emerald-100 text-emerald-800"
    };
  }

  if (status === "REJECTED") {
    return {
      title: "Request closed",
      description: "The rescuer declined this request. You can keep browsing for another good match.",
      toneClassName: "bg-rose-100 text-rose-700"
    };
  }

  return {
    title: "Request withdrawn",
    description: "You withdrew this request before a final placement decision.",
    toneClassName: "bg-stone-200 text-stone-700"
  };
}

export function getIncomingRequestGuidance(status: AdoptionRequest["status"]) {
  if (status === "PENDING") {
    return "New request. Review the message and contact the adopter if the fit looks promising.";
  }

  if (status === "CONTACTED") {
    return "Conversation started. Approve or reject once you have enough confidence in the match.";
  }

  if (status === "APPROVED") {
    return "Approved request. The adoption can now move toward its final handoff.";
  }

  if (status === "REJECTED") {
    return "Closed request. No more action needed unless you want to revisit the listing later.";
  }

  return "Withdrawn by the adopter. No more action is needed on this request.";
}

function getClosedListingReason(listingStatus: string) {
  if (listingStatus === "ADOPTED") {
    return "This pet has already been marked as adopted.";
  }

  if (listingStatus === "PENDING_APPROVAL") {
    return "This listing is still pending admin approval.";
  }

  if (listingStatus === "REJECTED") {
    return "This listing needs owner updates before it can accept requests again.";
  }

  if (listingStatus === "DRAFT" || listingStatus === "ARCHIVED") {
    return "This listing is not currently available for adoption requests.";
  }

  return "This listing is not currently accepting adoption requests.";
}
