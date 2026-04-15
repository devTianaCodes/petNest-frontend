export function QueryStateNotice({
  title,
  message,
  tone = "neutral"
}: {
  title: string;
  message: string;
  tone?: "neutral" | "error";
}) {
  return (
    <div
      className={`rounded-[28px] p-8 shadow-sm ring-1 ${
        tone === "error" ? "bg-rose-50 text-rose-900 ring-rose-200" : "bg-white text-ink ring-black/5"
      }`}
    >
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6">{message}</p>
    </div>
  );
}
