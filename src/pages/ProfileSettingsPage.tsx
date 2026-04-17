import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { useAuth } from "../features/auth/AuthContext";
import { getProfileValidationState } from "../features/auth/profileValidation";

export function ProfileSettingsPage() {
  const { user, refresh } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [state, setState] = useState(user?.state ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const validation = getProfileValidationState({
    fullName,
    phone,
    city,
    state,
    initialValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      city: user?.city ?? "",
      state: user?.state ?? ""
    },
    isSaving
  });

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

          if (!validation.canSubmit) {
            if (!validation.hasChanges) {
              setMessage("No profile changes to save.");
              return;
            }

            const firstError = Object.values(validation.errors).find(Boolean);
            if (firstError) {
              setError(firstError);
            }
            return;
          }

          setIsSaving(true);
          try {
            await apiRequest("/users/me", {
              method: "PATCH",
              body: {
                fullName: validation.trimmedFullName,
                phone: validation.trimmedPhone,
                city: validation.trimmedCity,
                state: validation.trimmedState
              }
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
        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink">Full name</span>
          <input
            className="w-full rounded-2xl border border-stone-200 px-4 py-3"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full name"
          />
          {validation.errors.fullName ? <p className="text-sm text-rose-700">{validation.errors.fullName}</p> : null}
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink">Phone</span>
          <input
            className="w-full rounded-2xl border border-stone-200 px-4 py-3"
            value={phone || ""}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone"
          />
          {validation.errors.phone ? <p className="text-sm text-rose-700">{validation.errors.phone}</p> : null}
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink">City</span>
          <input
            className="w-full rounded-2xl border border-stone-200 px-4 py-3"
            value={city || ""}
            onChange={(event) => setCity(event.target.value)}
            placeholder="City"
          />
          {validation.errors.city ? <p className="text-sm text-rose-700">{validation.errors.city}</p> : null}
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-ink">State</span>
          <input
            className="w-full rounded-2xl border border-stone-200 px-4 py-3"
            value={state || ""}
            onChange={(event) => setState(event.target.value)}
            placeholder="State"
          />
          {validation.errors.state ? <p className="text-sm text-rose-700">{validation.errors.state}</p> : null}
        </label>
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!validation.canSubmit}
            className="rounded-full bg-fern px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            className="rounded-full border border-ink/10 px-6 py-3 text-sm font-medium text-ink"
            onClick={() => {
              setError(null);
              setMessage(null);
              setFullName(user?.fullName ?? "");
              setPhone(user?.phone ?? "");
              setCity(user?.city ?? "");
              setState(user?.state ?? "");
            }}
          >
            Reset
          </button>
        </div>
        {!validation.hasChanges ? <p className="text-sm text-stone-500">No unsaved profile changes.</p> : null}
      </form>
    </section>
  );
}
