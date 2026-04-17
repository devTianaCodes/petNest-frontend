import assert from "node:assert/strict";
import test from "node:test";
import { getProfileValidationState } from "../dist-tests/src/features/auth/profileValidation.js";

function makeInput(overrides = {}) {
  return {
    fullName: "Jamie Foster",
    phone: "5551234567",
    city: "Boston",
    state: "MA",
    initialValues: {
      fullName: "Jamie Foster",
      phone: "5551234567",
      city: "Boston",
      state: "MA"
    },
    isSaving: false,
    ...overrides
  };
}

test("profile validation blocks unchanged form submission", () => {
  const result = getProfileValidationState(makeInput());

  assert.equal(result.hasChanges, false);
  assert.equal(result.canSubmit, false);
});

test("profile validation allows changed valid values", () => {
  const result = getProfileValidationState(
    makeInput({
      city: "Cambridge"
    })
  );

  assert.equal(result.hasChanges, true);
  assert.equal(result.canSubmit, true);
});

test("profile validation rejects short optional fields and full name", () => {
  const result = getProfileValidationState(
    makeInput({
      fullName: "J",
      phone: "123",
      city: "B",
      state: "M"
    })
  );

  assert.match(result.errors.fullName, /at least 2 characters/i);
  assert.match(result.errors.phone, /at least 7 characters/i);
  assert.match(result.errors.city, /at least 2 characters/i);
  assert.match(result.errors.state, /at least 2 characters/i);
  assert.equal(result.canSubmit, false);
});
