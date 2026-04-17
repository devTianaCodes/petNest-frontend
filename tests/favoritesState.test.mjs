import assert from "node:assert/strict";
import test from "node:test";
import { getFavoriteIds } from "../dist-tests/src/features/favorites/favoritesState.js";

test("favorite ids helper returns listing ids from favorite items", () => {
  const result = getFavoriteIds([
    { id: "fav_1", createdAt: "2024-01-01T00:00:00.000Z", listing: { id: "pet_1" } },
    { id: "fav_2", createdAt: "2024-01-02T00:00:00.000Z", listing: { id: "pet_2" } }
  ]);

  assert.equal(result.has("pet_1"), true);
  assert.equal(result.has("pet_2"), true);
  assert.equal(result.size, 2);
});
