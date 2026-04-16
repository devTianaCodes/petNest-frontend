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
    disabledReason = "This listing is not currently accepting adoption requests.";
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
