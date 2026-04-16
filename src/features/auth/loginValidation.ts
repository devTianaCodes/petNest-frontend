export function getLoginValidationState(input: {
  email: string;
  password: string;
  isSubmitting: boolean;
}) {
  const trimmedEmail = input.email.trim();
  const hasValidEmail = trimmedEmail.includes("@");
  const hasValidPassword = input.password.length >= 8;

  return {
    trimmedEmail,
    hasValidEmail,
    hasValidPassword,
    canSubmit: hasValidEmail && hasValidPassword && !input.isSubmitting
  };
}
