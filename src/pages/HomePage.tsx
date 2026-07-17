import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getHomeStats } from "../api/analytics";
import { getPets } from "../api/pets";
import { PetCard } from "../components/PetCard";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { getHomeStatCards, getHomeValueCards } from "../features/home/homePageMeta";
import { PUBLIC_QUERY_STALE_TIME_MS } from "../lib/query-client";

const successStories: Array<{
  quote: string;
  person: string;
  imageA: string;
  imageB: string;
  altA: string;
  altB: string;
}> = [
  {
    quote: "Adopting her filled our home with joy, and watching her relax with our family feels like the happiest ending we could have hoped for.",
    person: "Maya, foster volunteer",
    imageA: "/success-stories/story1A.jpg",
    imageB: "/success-stories/story1B.jpg",
    altA: "Maya with a rescued pet",
    altB: "Maya caring for the same rescue pet"
  },
  {
    quote: "The structured pet profile made it easier to decide if the match was right for our family.",
    person: "Elena, adopter",
    imageA: "/success-stories/story2A.jpg",
    imageB: "/success-stories/story2B.jpg",
    altA: "Elena with an adopted pet",
    altB: "Elena at home with the adopted pet"
  },
  {
    quote: "The day we adopted him, our family felt complete, and now every room in the house feels warmer with him in it.",
    person: "Roberta, adopter",
    imageA: "/success-stories/story3A.jpg",
    imageB: "/success-stories/story3B.jpg",
    altA: "Roberta with her adopted pet",
    altB: "Roberta relaxing at home with the adopted pet"
  },
  {
    quote: "Adopting her brought so much happiness into our family, and seeing her safe, playful, and loved every day is everything we wanted.",
    person: "Mark, adopter",
    imageA: "/success-stories/story4A.jpg",
    imageB: "/success-stories/story4B.jpg",
    altA: "Mark with his adopted pet",
    altB: "Mark enjoying time at home with the adopted pet"
  }
];

export function HomePage() {
  const statsQuery = useQuery({
    queryKey: ["home-stats"],
    queryFn: getHomeStats,
    staleTime: PUBLIC_QUERY_STALE_TIME_MS
  });
  const featuredParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "4");
    params.set("sort", "newest");
    return params;
  }, []);
  const featuredPetsQuery = useQuery({
    queryKey: ["pets", "home-featured"],
    queryFn: () => getPets(featuredParams),
    staleTime: PUBLIC_QUERY_STALE_TIME_MS
  });

  const statCards = statsQuery.data ? getHomeStatCards(statsQuery.data.stats) : [];
  const valueCards = getHomeValueCards();
  const statCardToneClasses = ["bg-white", "bg-fern/10", "bg-terracotta/10"];

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <section className="grid gap-6 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7 md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:rounded-[36px] md:p-14">
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Rescue-first adoption platform</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Fall in love, adopt a pet</h1>
          <p className="max-w-xl text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
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
        <div className="relative min-h-[240px] overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5 sm:min-h-[320px] md:rounded-[28px]">
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
          {statCards.map((card, index) => (
            <article
              key={card.label}
              className={`rounded-[22px] p-5 shadow-sm ring-1 ring-black/5 sm:rounded-[28px] sm:p-6 ${statCardToneClasses[index % statCardToneClasses.length]}`}
            >
              <p className="text-sm font-medium text-stone-500">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{card.value}</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{card.caption}</p>
            </article>
          ))}
        </section>
      )}

      <section className="space-y-4 rounded-[24px] bg-sand/60 p-5 shadow-sm ring-1 ring-black/5 sm:p-7 md:rounded-[32px] md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">Why PetNest feels calmer</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">A safer place for rescued pets and the people helping them</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {valueCards.map((card) => (
            <article key={card.title} className={`rounded-[22px] p-5 shadow-sm ring-1 ring-black/5 sm:rounded-[28px] sm:p-6 ${card.toneClassName}`}>
              <h2 className="text-xl font-semibold text-ink">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-[24px] bg-fern/10 p-5 shadow-sm ring-1 ring-black/5 sm:p-7 md:space-y-6 md:rounded-[32px] md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">Featured animals</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Meet a few pets looking for a stable home</h2>
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
        <div className="rounded-[24px] bg-terracotta/10 p-5 shadow-sm ring-1 ring-black/5 sm:p-7 md:rounded-[32px] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Success stories</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Love, safety, and a place to belong</h2>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {successStories.map((story) => (
              <article key={story.person} className="group overflow-hidden rounded-[22px] bg-canvas/80 sm:rounded-[28px] lg:h-[320px]">
                <div className="lg:flex lg:h-full lg:items-stretch">
                  <div className="flex min-h-[260px] flex-col p-5 sm:min-h-[320px] sm:p-6 lg:h-full lg:min-h-0 lg:basis-3/5 lg:px-8 lg:pt-8">
                    <blockquote>
                      <p className="text-[1.125rem] leading-[1.6] text-stone-700 lg:text-[1.125rem] lg:leading-[1.6]">“{story.quote}”</p>
                    </blockquote>
                    <footer className="mt-[30px] text-sm font-medium text-ink">{story.person}</footer>
                  </div>
                  <div className="relative min-h-[260px] overflow-hidden leading-none sm:min-h-[320px] lg:h-full lg:min-h-0 lg:basis-2/5">
                    <img
                      src={story.imageA}
                      alt={story.altA}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 block h-full w-full object-cover transition duration-500 group-hover:opacity-0"
                    />
                    <img
                      src={story.imageB}
                      alt={story.altB}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      className="absolute inset-0 block h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#8eaf99] bg-[#cfe0d4] p-5 text-ink shadow-sm sm:p-7 md:rounded-[32px] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern/90">Ready to help?</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Adopt now or post an animal that needs a safer match.</h2>
          <p className="mt-4 text-sm leading-7 text-ink/75">
            PetNest is built for rescued pets, foster homes, and independent rescuers who need a cleaner process than social-media posting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/adopt" className="rounded-full bg-fern px-5 py-3 text-sm font-medium text-white">
              Adopt now
            </Link>
            <Link to="/dashboard/listings/new" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-ink shadow-sm">
              Post an animal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
