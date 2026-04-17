import assert from "node:assert/strict";
import test from "node:test";
import {
  createBrowseSearchParams,
  getBrowseFilterChips,
  getBrowseFilters
} from "../dist-tests/src/features/pets/browseParams.js";

test("browse params parse defaults when search params are empty", () => {
  const filters = getBrowseFilters(new URLSearchParams());

  assert.deepEqual(filters, {
    search: "",
    category: "",
    sex: "",
    size: "",
    city: "",
    state: "",
    sort: "newest",
    view: "grid",
    page: 1
  });
});

test("browse params keep current filters and omit page one in URLs", () => {
  const params = createBrowseSearchParams({
    search: "luna",
    category: "cat",
    sex: "",
    size: "SMALL",
    city: "Boston",
    state: "MA",
    sort: "newest",
    view: "grid",
    page: 1
  });

  assert.equal(params.toString(), "search=luna&category=cat&size=SMALL&city=Boston&state=MA");
});

test("browse params preserve page when greater than one", () => {
  const filters = getBrowseFilters(
    new URLSearchParams("search=milo&category=dog&page=3")
  );

  assert.equal(filters.search, "milo");
  assert.equal(filters.category, "dog");
  assert.equal(filters.page, 3);
});

test("browse params keep non-default sort and view in URLs", () => {
  const params = createBrowseSearchParams({
    search: "",
    category: "",
    sex: "",
    size: "",
    city: "",
    state: "",
    sort: "name-asc",
    view: "list",
    page: 2
  });

  assert.equal(params.toString(), "sort=name-asc&view=list&page=2");
});

test("browse filter chips describe each active filter", () => {
  const chips = getBrowseFilterChips({
    search: "milo",
    category: "dog",
    sex: "MALE",
    size: "",
    city: "Austin",
    state: "",
    sort: "newest",
    view: "grid",
    page: 1
  });

  assert.deepEqual(chips, [
    { key: "search", label: "Search: milo" },
    { key: "category", label: "Category: dog" },
    { key: "sex", label: "Sex: male" },
    { key: "city", label: "City: Austin" }
  ]);
});
