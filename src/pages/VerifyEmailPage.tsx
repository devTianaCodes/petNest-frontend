import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import { QueryStateNotice } from "../components/QueryStateNotice";

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email token and preparing your account.");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    verifyEmail(token)
      .then((response) => {
        setStatus("success");
        setMessage(response.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage((error as Error).message);
      });
  }, [params]);

  if (status === "loading") {
    return <QueryStateNotice title="Verifying email" message={message} />;
  }

  if (status === "error") {
    return <QueryStateNotice title="Verification failed" message={message} tone="error" />;
  }

  return (
    <div className="mx-auto max-w-lg rounded-[32px] bg-emerald-50 p-8 text-emerald-950 shadow-sm ring-1 ring-emerald-200">
      <h1 className="text-2xl font-semibold">Email verified</h1>
      <p className="mt-3 text-sm leading-6">{message}</p>
    </div>
  );
}
