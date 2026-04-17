import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { getPostLoginRedirect } from "../features/auth/authRedirect";
import { getLoginValidationState } from "../features/auth/loginValidation";
import { getRegisterValidationState } from "../features/auth/registerValidation";

type AuthMode = "login" | "register";

type AuthPageProps = {
  initialMode?: AuthMode;
};

export function AuthPage({ initialMode = "login" }: AuthPageProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { signIn, signUp } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | undefined>();
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  const modeParam = searchParams.get("mode");
  const mode: AuthMode = modeParam === "register" ? "register" : initialMode;
  const redirectTarget = searchParams.get("redirect");
  const loginValidation = getLoginValidationState({
    email: loginEmail,
    password: loginPassword,
    isSubmitting: isLoginSubmitting
  });
  const registerValidation = getRegisterValidationState({
    fullName: registerName,
    email: registerEmail,
    password: registerPassword,
    confirmPassword,
    isSubmitting: isRegisterSubmitting
  });
  const registerBenefits = useMemo(
    () => [
      "Publish rescued pets with up to 3 photos",
      "Track adoption requests in one calmer inbox",
      "Save favorites and return to them later"
    ],
    []
  );

  function setMode(nextMode: AuthMode) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("mode", nextMode);
    setSearchParams(nextParams, { replace: true });
    setLoginError(null);
    setRegisterError(null);
  }

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);
    setIsLoginSubmitting(true);
    try {
      await signIn({ email: loginValidation.trimmedEmail, password: loginPassword });
      navigate(getPostLoginRedirect(redirectTarget), { replace: true });
    } catch (authError) {
      setLoginError((authError as Error).message);
    } finally {
      setIsLoginSubmitting(false);
    }
  }

  async function submitRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterError(null);
    setVerificationUrl(undefined);

    if (registerValidation.passwordMismatch) {
      setRegisterError("Passwords do not match.");
      return;
    }

    setIsRegisterSubmitting(true);
    try {
      const response = await signUp({
        fullName: registerValidation.trimmedName,
        email: registerValidation.trimmedEmail,
        password: registerPassword
      });
      setVerificationUrl(response.verificationUrl);
      setMode("login");
    } catch (authError) {
      setRegisterError((authError as Error).message);
    } finally {
      setIsRegisterSubmitting(false);
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <aside className="rounded-[32px] bg-ink p-8 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">PetNest account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {mode === "login" ? "Welcome back to PetNest" : "Create one calm place for adoption work"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/80">
          {mode === "login"
            ? "Log in to manage listings, review adoption requests, and keep rescued pets moving toward a safer home."
            : "Register once, verify your email, and start listing rescued pets or tracking the animals you love."}
        </p>
        <div className="mt-8 rounded-[28px] bg-white/10 p-6">
          <p className="text-sm font-semibold text-white">What you can do here</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/80">
            {registerBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center gap-2 rounded-full bg-sand/70 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "login" ? "bg-white text-ink shadow-sm" : "text-stone-600"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "register" ? "bg-fern text-white shadow-sm" : "text-stone-600"
            }`}
          >
            Register
          </button>
        </div>

        {verificationUrl ? (
          <div className="mt-6 rounded-2xl bg-sand/60 p-4 text-sm text-stone-800">
            Account created. In development, verify here: <span className="break-all">{verificationUrl}</span>
          </div>
        ) : null}

        {mode === "login" ? (
          <form className="mt-6 space-y-4" onSubmit={submitLogin}>
            <div>
              <label htmlFor="login-email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="login-email"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                placeholder="rescuer@example.com"
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="login-password"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                placeholder="Your password"
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
              />
            </div>
            {!loginValidation.hasValidEmail && loginValidation.trimmedEmail.length > 0 ? (
              <p className="text-sm text-rose-700">Enter a valid email address.</p>
            ) : null}
            {loginPassword.length > 0 && !loginValidation.hasValidPassword ? (
              <p className="text-sm text-rose-700">Password must be at least 8 characters.</p>
            ) : null}
            {loginError ? <p className="text-sm text-rose-700">{loginError}</p> : null}
            <button
              type="submit"
              disabled={!loginValidation.canSubmit}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
            >
              {isLoginSubmitting ? "Logging in..." : "Log in"}
            </button>
            <p className="text-sm text-stone-600">
              Need an account?{" "}
              <button type="button" onClick={() => setMode("register")} className="font-medium text-fern">
                Register here
              </button>
            </p>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submitRegister}>
            <div>
              <label htmlFor="register-name" className="text-sm font-medium text-ink">
                Full name
              </label>
              <input
                id="register-name"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                placeholder="Your full name"
                value={registerName}
                onChange={(event) => setRegisterName(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="register-email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="register-email"
                className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                placeholder="you@example.com"
                type="email"
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="register-password" className="text-sm font-medium text-ink">
                  Password
                </label>
                <input
                  id="register-password"
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  placeholder="At least 8 characters"
                  type="password"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="register-confirm-password" className="text-sm font-medium text-ink">
                  Confirm password
                </label>
                <input
                  id="register-confirm-password"
                  className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3"
                  placeholder="Repeat your password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
            </div>
            {!registerValidation.hasValidEmail && registerValidation.trimmedEmail.length > 0 ? (
              <p className="text-sm text-rose-700">Enter a valid email address.</p>
            ) : null}
            {registerPassword.length > 0 && !registerValidation.hasValidPassword ? (
              <p className="text-sm text-rose-700">Password must be at least 8 characters.</p>
            ) : null}
            {registerValidation.passwordMismatch ? <p className="text-sm text-rose-700">Passwords do not match.</p> : null}
            {registerError ? <p className="text-sm text-rose-700">{registerError}</p> : null}
            <button
              type="submit"
              disabled={!registerValidation.canSubmit}
              className="rounded-full bg-fern px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
            >
              {isRegisterSubmitting ? "Registering..." : "Register"}
            </button>
            <p className="text-sm text-stone-600">
              Already registered?{" "}
              <button type="button" onClick={() => setMode("login")} className="font-medium text-fern">
                Log in here
              </button>
            </p>
          </form>
        )}

        <p className="mt-6 text-sm text-stone-600">
          Rescue-first platform. Need to browse first?{" "}
          <Link to="/adopt" className="font-medium text-fern">
            View adoption listings
          </Link>
        </p>
      </div>
    </section>
  );
}
