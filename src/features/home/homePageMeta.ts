import type { Category } from "../../types/pets";
import type { HomeStats } from "../../types/home";

export function getHomeStatCards(stats: HomeStats) {
  return [
    {
      label: "Ready to adopt",
      value: String(stats.publishedListings),
      caption: "Published pets visible now"
    },
    {
      label: "Already adopted",
      value: String(stats.adoptedListings),
      caption: "Successful placements tracked"
    },
    {
      label: "Requests sent",
      value: String(stats.totalRequests),
      caption: `${stats.totalFavorites} saved favorites across the app`
    }
  ];
}

export function getQuickCategoryLinks(categories: Category[]) {
  return categories.slice(0, 4).map((category) => ({
    label: category.name,
    to: `/browse?category=${category.slug}`
  }));
}
