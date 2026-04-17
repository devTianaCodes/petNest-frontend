import assert from "node:assert/strict";
import test from "node:test";
import {
  getPetGalleryImages,
  getPetShareLinks
} from "../dist-tests/src/features/pets/petDetailsMeta.js";

test("pet gallery falls back to placeholder when no images exist", () => {
  const images = getPetGalleryImages({
    name: "Milo",
    images: []
  });

  assert.equal(images.length, 1);
  assert.match(images[0].imageUrl, /placehold\.co/);
});

test("pet share links build share targets from pathname", () => {
  const originalWindow = global.window;
  global.window = {
    location: { origin: "http://127.0.0.1:5174" }
  };

  try {
    const links = getPetShareLinks("/pets/pet_1", "Milo");

    assert.equal(links.copyUrl, "http://127.0.0.1:5174/pets/pet_1");
    assert.match(links.facebook, /facebook\.com\/sharer/);
    assert.match(links.email, /mailto:/);
  } finally {
    global.window = originalWindow;
  }
});
