import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setMessage("Missing verification token.");
      return;
    }

    verifyEmail(token)
      .then((response) => setMessage(response.message))
      .catch((error) => setMessage((error as Error).message));
  }, [params]);

  return <div className="mx-auto max-w-lg rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">{message}</div>;
}
