import assert from "node:assert/strict";
import test from "node:test";
import { getPendingListingMeta } from "../dist-tests/src/features/admin/pendingListingMeta.js";

test("pending listing meta builds summary and cover image", () => {
  const result = getPendingListingMeta({
    breedPrimary: "Shepherd",
    breedSecondary: "Collie",
    ageLabel: "2 years",
    images: [{ id: "img_1", imageUrl: "https://example.com/pet.jpg", sortOrder: 0 }],
    rescueStory: "Found during a storm.",
    healthNotes: null
  });

  assert.equal(result.breedLabel, "Shepherd / Collie");
  assert.equal(result.coverImage, "https://example.com/pet.jpg");
  assert.equal(result.noteCount, 1);
  assert.equal(result.summary, "2 years • Shepherd / Collie");
});

test("pending listing meta falls back when breed and images are missing", () => {
  const result = getPendingListingMeta({
    breedPrimary: null,
    breedSecondary: null,
    ageLabel: "Adult",
    images: [],
    rescueStory: null,
    healthNotes: null
  });

  assert.match(result.coverImage, /placehold\.co/);
  assert.equal(result.breedLabel, "Unknown breed");
  assert.equal(result.hasExtraNotes, false);
});
