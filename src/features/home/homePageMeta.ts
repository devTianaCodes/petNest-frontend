import type { HomeStats } from "../../types/home";

const showcasedAdoptedCount = 19;
const showcasedRequestCount = 14;

export function getHomeStatCards(stats: HomeStats) {
  return [
    {
      label: "Ready to adopt",
      value: String(stats.publishedListings),
      caption: "Published pets visible now"
    },
    {
      label: "Already adopted",
      value: String(showcasedAdoptedCount),
      caption: "Successful placements tracked"
    },
    {
      label: "Requests sent",
      value: String(showcasedRequestCount),
      caption: `${stats.totalFavorites} saved favorites across the app`
    }
  ];
}

export function getHomeValueCards() {
  return [
    {
      title: "Verified listing owners",
      description: "Email verification and moderation keep the first version safer than social posting.",
      toneClassName: "bg-fern/10"
    },
    {
      title: "Structured pet profiles",
      description: "Age, category, behavior notes, and rescue context make adoption decisions clearer.",
      toneClassName: "bg-fern/10"
    },
    {
      title: "Private request flow",
      description: "Adopters apply inside the app instead of exposing contact details publicly.",
      toneClassName: "bg-fern/10"
    }
  ];
}
