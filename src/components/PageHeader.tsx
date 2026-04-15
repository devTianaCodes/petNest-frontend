export function PageHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">{eyebrow}</p> : null}
      <h1 className="text-4xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="max-w-2xl text-base leading-7 text-stone-700">{description}</p>
    </div>
  );
}
