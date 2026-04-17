import assert from "node:assert/strict";
import test from "node:test";
import {
  createSavedSearchLabel,
  createSavedSearchLink,
  getSavedSearchSummary
} from "../dist-tests/src/features/saved-searches/savedSearchMeta.js";

test("saved search label prefers explicit text search", () => {
  const label = createSavedSearchLabel({
    search: "milo",
    category: "dog",
    sex: "",
    size: "",
    city: "Austin",
    state: "",
    sort: "newest",
    view: "grid",
    page: 1
  });

  assert.equal(label, "Search: milo");
});

test("saved search label falls back to category and city", () => {
  const label = createSavedSearchLabel({
    search: "",
    category: "cat",
    sex: "",
    size: "",
    city: "Boston",
    state: "",
    sort: "newest",
    view: "grid",
    page: 1
  });

  assert.equal(label, "Cat in Boston");
});

test("saved search helpers create browse links and readable summaries", () => {
  const search = {
    id: "search_1",
    label: "Cats in Boston",
    queryString: "category=cat&city=Boston",
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-02-01T00:00:00.000Z"
  };

  assert.equal(createSavedSearchLink(search), "/browse?category=cat&city=Boston");
  assert.equal(getSavedSearchSummary(search), "category: cat • city: Boston");
});
