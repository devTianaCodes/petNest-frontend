import assert from "node:assert/strict";
import test from "node:test";
import { getOptimizedPetImageUrl } from "../dist-tests/src/features/pets/petImageUrl.js";

test("pet image URL adds Cloudinary delivery optimization", () => {
  const result = getOptimizedPetImageUrl(
    "https://res.cloudinary.com/demo/image/upload/v123/petnest/milo.jpg",
    720
  );

  assert.equal(
    result,
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:eco,c_limit,w_720/v123/petnest/milo.jpg"
  );
});

test("pet image URL leaves non-Cloudinary sources unchanged", () => {
  const source = "https://images.example.com/pets/milo.jpg";

  assert.equal(getOptimizedPetImageUrl(source, 720), source);
});

test("pet image URL uses the compressed PetNest demo asset", () => {
  const result = getOptimizedPetImageUrl(
    "https://petnest-frontend.vercel.app/success-stories/story2A.png",
    720
  );

  assert.equal(
    result,
    "/success-stories/story2A.jpg"
  );
});

test("pet image URL leaves invalid widths and URLs unchanged", () => {
  assert.equal(getOptimizedPetImageUrl("not-a-url", 720), "not-a-url");
  assert.equal(
    getOptimizedPetImageUrl("https://res.cloudinary.com/demo/image/upload/milo.jpg", 0),
    "https://res.cloudinary.com/demo/image/upload/milo.jpg"
  );
});
