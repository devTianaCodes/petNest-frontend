import assert from "node:assert/strict";
import test from "node:test";
import { getPetCardMeta } from "../dist-tests/src/components/petCardMeta.js";

function makePet(overrides = {}) {
  return {
    id: "pet_1",
    name: "Milo",
    description: "Friendly rescue dog looking for a stable home.",
    ageLabel: "2 years",
    sex: "MALE",
    size: "MEDIUM",
    city: "Boston",
    state: "MA",
    status: "PUBLISHED",
    category: {
      id: "cat_1",
      name: "Dog",
      slug: "dog"
    },
    images: [
      { id: "img_1", imageUrl: "https://example.com/one.jpg", sortOrder: 0 },
      { id: "img_2", imageUrl: "https://example.com/two.jpg", sortOrder: 1 }
    ],
    ...overrides
  };
}

test("pet card meta includes hover image and breed detail label", () => {
  const result = getPetCardMeta(makePet({ breedPrimary: "Shepherd", breedSecondary: "Collie" }));

  assert.equal(result.coverImage, "https://example.com/one.jpg");
  assert.equal(result.hoverImage, "https://example.com/two.jpg");
  assert.equal(result.breedLabel, "Shepherd / Collie");
  assert.equal(result.detailLabel, "2 years • Shepherd / Collie");
});

test("pet card meta falls back to placeholder and sex label", () => {
  const result = getPetCardMeta(makePet({ images: [], breedPrimary: null, breedSecondary: null, sex: "FEMALE" }));

  assert.match(result.coverImage, /placehold\.co\/640x420\?text=PetNest/);
  assert.equal(result.hoverImage, undefined);
  assert.equal(result.detailLabel, "2 years • female");
});
