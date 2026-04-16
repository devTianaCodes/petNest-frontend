import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

export function RegisterPage() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationUrl, setVerificationUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = fullName.trim();
  const trimmedEmail = email.trim();
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit =
    trimmedName.length >= 2 &&
    trimmedEmail.includes("@") &&
    password.length >= 8 &&
    !passwordMismatch &&
    !isSubmitting;

  return (
    <section className="mx-auto max-w-lg rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Create account</h1>
      <p className="mt-3 text-sm leading-6 text-stone-700">
        Verified users can publish listings and manage private adoption requests.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setVerificationUrl(undefined);

          if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
          }

          setIsSubmitting(true);
          try {
            const response = await signUp({ fullName: trimmedName, email: trimmedEmail, password });
            setVerificationUrl(response.verificationUrl);
          } catch (registerError) {
            setError((registerError as Error).message);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <input
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          placeholder="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
        <input
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        {password.length > 0 && password.length < 8 ? (
          <p className="text-sm text-rose-700">Password must be at least 8 characters.</p>
        ) : null}
        {!trimmedEmail.includes("@") && trimmedEmail.length > 0 ? (
          <p className="text-sm text-rose-700">Enter a valid email address.</p>
        ) : null}
        {passwordMismatch ? <p className="text-sm text-rose-700">Passwords do not match.</p> : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {verificationUrl ? (
          <div className="rounded-2xl bg-sand/60 p-4 text-sm text-stone-800">
            Account created. In development, verify here: <span className="break-all">{verificationUrl}</span>
          </div>
        ) : null}
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-fern px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
}
