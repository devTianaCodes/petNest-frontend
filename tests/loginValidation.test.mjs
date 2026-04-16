import assert from "node:assert/strict";
import test from "node:test";
import { getLoginValidationState } from "../dist-tests/src/features/auth/loginValidation.js";

test("login validation allows valid credentials", () => {
  const result = getLoginValidationState({
    email: "  hello@petnest.app ",
    password: "password123",
    isSubmitting: false
  });

  assert.equal(result.trimmedEmail, "hello@petnest.app");
  assert.equal(result.canSubmit, true);
});

test("login validation blocks invalid email, short password, and pending submit", () => {
  const invalid = getLoginValidationState({
    email: "hello",
    password: "short",
    isSubmitting: false
  });
  const pending = getLoginValidationState({
    email: "hello@petnest.app",
    password: "password123",
    isSubmitting: true
  });

  assert.equal(invalid.hasValidEmail, false);
  assert.equal(invalid.hasValidPassword, false);
  assert.equal(invalid.canSubmit, false);
  assert.equal(pending.canSubmit, false);
});
