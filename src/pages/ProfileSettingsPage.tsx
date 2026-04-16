import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "../features/auth/AuthContext";

export function ProfileSettingsPage() {
  const { user, refresh } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [state, setState] = useState(user?.state ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const trimmedName = fullName.trim();

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setPhone(user?.phone ?? "");
    setCity(user?.city ?? "");
    setState(user?.state ?? "");
  }, [user?.city, user?.fullName, user?.phone, user?.state]);

  return (
    <section className="max-w-2xl rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Profile settings</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setMessage(null);

          if (trimmedName.length < 2) {
            setError("Full name must be at least 2 characters.");
            return;
          }

          setIsSaving(true);
          try {
            await apiRequest("/users/me", {
              method: "PATCH",
              body: { fullName: trimmedName, phone, city, state }
            });
            await refresh();
            setMessage("Profile updated.");
          } catch (updateError) {
            setError((updateError as Error).message);
          } finally {
            setIsSaving(false);
          }
        }}
      >
        <input
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
        />
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" value={phone || ""} onChange={(event) => setPhone(event.target.value)} placeholder="Phone" />
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" value={city || ""} onChange={(event) => setCity(event.target.value)} placeholder="City" />
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" value={state || ""} onChange={(event) => setState(event.target.value)} placeholder="State" />
        {trimmedName.length > 0 && trimmedName.length < 2 ? <p className="text-sm text-rose-700">Full name must be at least 2 characters.</p> : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        <button
          type="submit"
          disabled={isSaving || trimmedName.length < 2}
          className="rounded-full bg-fern px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}
