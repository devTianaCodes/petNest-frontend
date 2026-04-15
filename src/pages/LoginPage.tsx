import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-lg rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Log in</h1>
      <p className="mt-3 text-sm leading-6 text-stone-700">Access your listings, requests, and moderation updates.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          try {
            await signIn({ email, password });
            navigate("/dashboard");
          } catch (authError) {
            setError((authError as Error).message);
          }
        }}
      >
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
        <button type="submit" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white">
          Log in
        </button>
      </form>
    </section>
  );
}
