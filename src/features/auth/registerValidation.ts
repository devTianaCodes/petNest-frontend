export type RegisterValidationState = {
  trimmedName: string;
  trimmedEmail: string;
  passwordMismatch: boolean;
  hasValidEmail: boolean;
  hasValidPassword: boolean;
  canSubmit: boolean;
};

export function getRegisterValidationState(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  isSubmitting: boolean;
}): RegisterValidationState {
  const trimmedName = input.fullName.trim();
  const trimmedEmail = input.email.trim();
  const passwordMismatch = input.confirmPassword.length > 0 && input.password !== input.confirmPassword;
  const hasValidEmail = trimmedEmail.includes("@");
  const hasValidPassword = input.password.length >= 8;

  return {
    trimmedName,
    trimmedEmail,
    passwordMismatch,
    hasValidEmail,
    hasValidPassword,
    canSubmit: trimmedName.length >= 2 && hasValidEmail && hasValidPassword && !passwordMismatch && !input.isSubmitting
  };
}
