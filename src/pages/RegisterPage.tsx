import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

export function RegisterPage() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationUrl, setVerificationUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

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
          try {
            const response = await signUp({ fullName, email, password });
            setVerificationUrl(response.verificationUrl);
          } catch (registerError) {
            setError((registerError as Error).message);
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
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {verificationUrl ? (
          <div className="rounded-2xl bg-sand/60 p-4 text-sm text-stone-800">
            Account created. In development, verify here: <span className="break-all">{verificationUrl}</span>
          </div>
        ) : null}
        <button type="submit" className="rounded-full bg-fern px-6 py-3 text-sm font-medium text-white">
          Register
        </button>
      </form>
    </section>
  );
}
