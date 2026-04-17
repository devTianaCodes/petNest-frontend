type ProfileValidationInput = {
  fullName: string;
  phone: string;
  city: string;
  state: string;
  initialValues: {
    fullName: string;
    phone: string;
    city: string;
    state: string;
  };
  isSaving: boolean;
};

export function getProfileValidationState(input: ProfileValidationInput) {
  const trimmedFullName = input.fullName.trim();
  const trimmedPhone = input.phone.trim();
  const trimmedCity = input.city.trim();
  const trimmedState = input.state.trim();

  const errors = {
    fullName: trimmedFullName.length >= 2 ? "" : "Full name must be at least 2 characters.",
    phone: trimmedPhone.length === 0 || trimmedPhone.length >= 7 ? "" : "Phone must be at least 7 characters or left empty.",
    city: trimmedCity.length === 0 || trimmedCity.length >= 2 ? "" : "City must be at least 2 characters or left empty.",
    state: trimmedState.length === 0 || trimmedState.length >= 2 ? "" : "State must be at least 2 characters or left empty."
  };

  const hasChanges =
    trimmedFullName !== input.initialValues.fullName.trim() ||
    trimmedPhone !== input.initialValues.phone.trim() ||
    trimmedCity !== input.initialValues.city.trim() ||
    trimmedState !== input.initialValues.state.trim();

  const canSubmit = !input.isSaving && hasChanges && Object.values(errors).every((error) => !error);

  return {
    trimmedFullName,
    trimmedPhone,
    trimmedCity,
    trimmedState,
    errors,
    hasChanges,
    canSubmit
  };
}
