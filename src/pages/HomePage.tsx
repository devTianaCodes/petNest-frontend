import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[36px] bg-gradient-to-br from-sand to-white p-10 shadow-sm ring-1 ring-black/5 md:grid-cols-[1.1fr_0.9fr] md:p-14">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Rescue-first adoption platform</p>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-ink">
            Give rescued pets a safer path to a stable home.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-stone-700">
            PetNest helps rescuers publish structured adoption listings and gives adopters a calmer, more trustworthy
            way to connect.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/browse" className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white">
              Browse pets
            </Link>
            <Link to="/register" className="rounded-full border border-ink/10 px-6 py-3 text-sm font-medium text-ink">
              Start listing
            </Link>
          </div>
        </div>
        <div className="rounded-[28px] bg-[url('https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center min-h-[320px]" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Verified listing owners", "Email verification and moderation keep the first version safer than social posting."],
          ["Structured pet profiles", "Age, category, behavior notes, and rescue context make adoption decisions clearer."],
          ["Private request flow", "Adopters apply inside the app instead of exposing contact details publicly."]
        ].map(([title, description]) => (
          <article key={title} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-semibold text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
