import assert from "node:assert/strict";
import test from "node:test";
import { getRegisterValidationState } from "../dist-tests/src/features/auth/registerValidation.js";

test("register validation allows a complete valid form", () => {
  const result = getRegisterValidationState({
    fullName: "  Pet Nest  ",
    email: "  hello@petnest.app ",
    password: "password123",
    confirmPassword: "password123",
    isSubmitting: false
  });

  assert.equal(result.trimmedName, "Pet Nest");
  assert.equal(result.trimmedEmail, "hello@petnest.app");
  assert.equal(result.passwordMismatch, false);
  assert.equal(result.canSubmit, true);
});

test("register validation blocks mismatched passwords and short password", () => {
  const result = getRegisterValidationState({
    fullName: "Pet Nest",
    email: "hello@petnest.app",
    password: "short",
    confirmPassword: "shorter",
    isSubmitting: false
  });

  assert.equal(result.hasValidPassword, false);
  assert.equal(result.passwordMismatch, true);
  assert.equal(result.canSubmit, false);
});
