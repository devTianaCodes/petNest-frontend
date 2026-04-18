import assert from "node:assert/strict";
import test from "node:test";
import {
  getHomeHeroBadges,
  getHomeStatCards,
  getHomeValueCards
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
  assert.deepEqual(cards[1], {
    label: "Already adopted",
    value: "19",
    caption: "Successful placements tracked"
  });
  assert.deepEqual(cards[2], {
    label: "Requests sent",
    value: "14",
    caption: "20 saved favorites across the app"
  });
});

test("home hero badges and value cards stay aligned with the landing page", () => {
  assert.deepEqual(getHomeHeroBadges(), ["Verified rescuers", "Private requests", "Rescue-first flow"]);
  assert.equal(getHomeValueCards().length, 3);
  assert.equal(getHomeValueCards()[1].title, "Structured pet profiles");
});
