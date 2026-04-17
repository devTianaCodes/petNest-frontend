import assert from "node:assert/strict";
import test from "node:test";
import {
  getHomeStatCards,
  getQuickCategoryLinks
} from "../dist-tests/src/features/home/homePageMeta.js";

test("home stat cards format homepage metrics", () => {
  const cards = getHomeStatCards({
    publishedListings: 14,
    adoptedListings: 39,
    pendingListings: 3,
    totalFavorites: 20,
    totalRequests: 17
  });

  assert.deepEqual(cards[0], {
    label: "Ready to adopt",
    value: "14",
    caption: "Published pets visible now"
  });
  assert.deepEqual(cards[2], {
    label: "Requests sent",
    value: "17",
    caption: "20 saved favorites across the app"
  });
});

test("quick category links keep the first four category slugs", () => {
  const links = getQuickCategoryLinks([
    { id: "1", name: "Dog", slug: "dog" },
    { id: "2", name: "Cat", slug: "cat" },
    { id: "3", name: "Rabbit", slug: "rabbit" },
    { id: "4", name: "Bird", slug: "bird" },
    { id: "5", name: "Reptile", slug: "reptile" }
  ]);

  assert.deepEqual(links, [
    { label: "Dog", to: "/browse?category=dog" },
    { label: "Cat", to: "/browse?category=cat" },
    { label: "Rabbit", to: "/browse?category=rabbit" },
    { label: "Bird", to: "/browse?category=bird" }
  ]);
});
