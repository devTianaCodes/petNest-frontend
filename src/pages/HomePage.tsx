import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getHomeStats } from "../api/analytics";
import { getPets } from "../api/pets";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { getHomeStatCards, getHomeValueCards } from "../features/home/homePageMeta";

const successStories = [
  {
    quote: "We found a calmer way to review adopters than social media messages and random DMs.",
    person: "Maya, foster volunteer",
    happyLine: "Seeing her finally settled in a gentle forever home made every rescue shift worth it.",
    imageA: "/success-stories/story1A.png",
    imageB: "/success-stories/story1B.png",
    altA: "Maya with a rescued pet",
    altB: "Maya caring for the same rescue pet"
  },
  {
    quote: "The structured pet profile made it easier to decide if the match was right for our family.",
    person: "Elena, adopter",
    happyLine: "Now our mornings are louder, warmer, and a lot happier with our new best friend.",
    imageA: "/success-stories/story2A.png",
    imageB: "/success-stories/story2B.png",
    altA: "Elena with an adopted pet",
    altB: "Elena at home with the adopted pet"
  },
  {
    quote: "We felt confident from the first message because the whole process stayed calm and clear.",
    person: "Daniel, adopter",
    happyLine: "Bringing him home changed the rhythm of our house in the best possible way.",
    imageA: "/success-stories/story3A.png",
    imageB: "/success-stories/story3B.png",
    altA: "Daniel with his adopted pet",
    altB: "Daniel relaxing at home with the adopted pet"
  },
  {
    quote: "PetNest helped us focus on the pet’s personality instead of sorting through noisy conversations.",
    person: "Sofia, adopter",
    happyLine: "Every evening now ends with a wagging tail and the feeling that our home is complete.",
    imageA: "/success-stories/story4A.png",
    imageB: "/success-stories/story4B.png",
    altA: "Sofia with her adopted pet",
    altB: "Sofia enjoying time at home with the adopted pet"
  }
] as const;

export function HomePage() {
  const statsQuery = useQuery({
    queryKey: ["home-stats"],
    queryFn: getHomeStats
  });
  const featuredParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "4");
    params.set("sort", "newest");
    return params;
  }, []);
  const featuredPetsQuery = useQuery({
    queryKey: ["pets", "home-featured"],
    queryFn: () => getPets(featuredParams)
  });

  const statCards = statsQuery.data ? getHomeStatCards(statsQuery.data.stats) : [];
  const valueCards = getHomeValueCards();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[36px] bg-gradient-to-br from-sand to-white p-10 shadow-sm ring-1 ring-black/5 md:grid-cols-[1.1fr_0.9fr] md:p-14">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Rescue-first adoption platform</p>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-ink">Fall in love, adopt a pet</h1>
          <p className="max-w-xl text-lg leading-8 text-stone-700">
            PetNest helps rescuers publish structured adoption listings and gives adopters a calmer, more trustworthy
            way to connect.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/adopt" className="rounded-full bg-fern px-6 py-3 text-sm font-medium text-white">
              View animals
            </Link>
            <Link to="/auth?mode=register" className="rounded-full border border-ink/10 px-6 py-3 text-sm font-medium text-ink">
              Start listing
            </Link>
          </div>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero.png')" }}
          />
        </div>
      </section>

      {statsQuery.isError ? (
        <QueryStateNotice
          title="Homepage stats could not load"
          message={(statsQuery.error as Error).message || "Public adoption stats are unavailable right now."}
          tone="error"
        />
      ) : statsQuery.isLoading ? (
        <QueryStateNotice title="Loading stats" message="Preparing the latest PetNest adoption totals." />
      ) : (
        <section className="grid gap-4 md:grid-cols-3">
          {statCards.map((card) => (
            <article key={card.label} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <p className="text-sm font-medium text-stone-500">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{card.value}</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{card.caption}</p>
            </article>
          ))}
        </section>
      )}

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">Why PetNest feels calmer</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-ink">A safer rhythm for rescued pets and the people helping them</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((card) => (
            <article key={card.title} className={`rounded-[28px] p-6 shadow-sm ring-1 ring-black/5 ${card.toneClassName}`}>
              <h2 className="text-xl font-semibold text-ink">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">Featured animals</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Meet a few pets looking for a stable home</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
              A few recent listings from rescuers and foster homes already using the calmer PetNest flow.
            </p>
          </div>
          <Link to="/adopt" className="rounded-full border border-ink/10 px-5 py-3 text-sm font-medium text-ink">
            See all adoption listings
          </Link>
        </div>

        {featuredPetsQuery.isError ? (
          <QueryStateNotice
            title="Featured animals could not load"
            message={(featuredPetsQuery.error as Error).message || "Published animals are unavailable right now."}
            tone="error"
          />
        ) : featuredPetsQuery.isLoading ? (
          <QueryStateNotice title="Loading featured animals" message="Pulling the newest published adoption listings." />
        ) : featuredPetsQuery.data?.items.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredPetsQuery.data.items.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <QueryStateNotice
            title="No featured animals yet"
            message="As soon as published listings exist, a few of them will appear here on the homepage."
          />
        )}
      </section>

      <section className="space-y-6">
        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Success stories</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Love, safety, and a place to belong</h2>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {successStories.map((story) => (
              <article key={story.person} className="group overflow-hidden rounded-[28px] bg-canvas/80">
                <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr]">
                  <div className="flex min-h-[320px] flex-col justify-center p-6 lg:p-8">
                    <blockquote>
                      <p className="text-xl leading-8 text-stone-700">“{story.quote}”</p>
                      <footer className="mt-4 text-sm font-medium text-ink">{story.person}</footer>
                    </blockquote>
                    <p className="mt-6 text-sm leading-6 text-stone-700">{story.happyLine}</p>
                  </div>
                  <div className="relative min-h-[320px] overflow-hidden">
                    <img
                      src={story.imageA}
                      alt={story.altA}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:opacity-0"
                    />
                    <img
                      src={story.imageB}
                      alt={story.altB}
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-ink p-8 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Ready to help?</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Adopt now or post an animal that needs a safer match.</h2>
          <p className="mt-4 text-sm leading-7 text-white/80">
            PetNest is built for rescued pets, foster homes, and independent rescuers who need a cleaner process than social-media posting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/adopt" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-ink">
              Adopt now
            </Link>
            <Link to="/dashboard/listings/new" className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white">
              Post an animal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
