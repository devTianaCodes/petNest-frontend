export function getCreateListingProgress(input: { hasListingId: boolean; hasUploadedImages: boolean }) {
  if (!input.hasListingId) {
    return {
      title: "Step 1 of 2",
      description: "Save the pet details first to create a draft listing."
    };
  }

  if (!input.hasUploadedImages) {
    return {
      title: "Draft saved",
      description: "Upload at least one image next. After that, submit the listing from your dashboard for admin review."
    };
  }

  return {
    title: "Ready for review",
    description: "Your draft now has photos. Open My listings to submit it for approval or keep editing before you submit."
  };
}

export function getCreateListingSubmitState(input: {
  hasListingId: boolean;
  hasUploadedImages: boolean;
  isEmailVerified: boolean;
  isSubmitting: boolean;
}) {
  const canSubmit = input.hasListingId && input.hasUploadedImages && input.isEmailVerified && !input.isSubmitting;

  let description = "";

  if (!input.hasListingId) {
    description = "Save the listing first.";
  } else if (!input.hasUploadedImages) {
    description = "Upload at least one image before submitting.";
  } else if (!input.isEmailVerified) {
    description = "Verify your email before submitting this listing for admin review.";
  } else if (input.isSubmitting) {
    description = "Submitting listing for admin review.";
  } else {
    description = "Ready to submit for admin review.";
  }

  return {
    canSubmit,
    description
  };
}
