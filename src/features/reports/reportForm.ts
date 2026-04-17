export function canSubmitListingReport(input: { reason: string; details: string; isOwner: boolean; isSubmitting: boolean }) {
  const reason = input.reason.trim();
  const details = input.details.trim();

  return {
    reason,
    details,
    canSubmit: !input.isOwner && !input.isSubmitting && reason.length >= 4 && details.length >= 10
  };
}
