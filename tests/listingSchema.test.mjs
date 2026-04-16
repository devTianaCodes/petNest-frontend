import assert from "node:assert/strict";
import test from "node:test";
import { listingSchema } from "../dist-tests/src/features/pets/ListingForm.js";

function makeValidListing() {
  return {
    categoryId: "cat_1",
    name: "Milo",
    description: "Friendly rescue dog with calm manners, strong leash skills, and a gentle temperament.",
    ageLabel: "2 years",
    ageValue: 2,
    ageUnit: "YEARS",
    sex: "MALE",
    size: "MEDIUM",
    breedPrimary: "Shepherd",
    breedSecondary: "",
    isMixedBreed: true,
    energyLevel: "MEDIUM",
    houseTrained: true,
    spayedNeutered: true,
    vaccinated: true,
    city: "Boston",
    state: "MA",
    contactEmail: "hello@petnest.app",
    contactPhone: "",
    rescueStory: "",
    healthNotes: "",
    goodWithKids: true,
    goodWithDogs: true,
    goodWithCats: false
  };
}

test("listing schema accepts a complete valid listing payload", () => {
  const result = listingSchema.safeParse(makeValidListing());

  assert.equal(result.success, true);
});

test("listing schema rejects missing age, city, state, and invalid contact email", () => {
  const result = listingSchema.safeParse({
    ...makeValidListing(),
    ageLabel: "",
    city: "",
    state: "",
    contactEmail: "not-an-email"
  });

  assert.equal(result.success, false);
  const issues = result.error.flatten().fieldErrors;
  assert.ok(issues.ageLabel?.length);
  assert.ok(issues.city?.length);
  assert.ok(issues.state?.length);
  assert.ok(issues.contactEmail?.length);
});
