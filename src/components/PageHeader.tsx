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
    <div className="space-y-2.5 sm:space-y-3">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="max-w-2xl text-sm leading-6 text-stone-700 sm:text-base sm:leading-7">{description}</p>
    </div>
  );
}
