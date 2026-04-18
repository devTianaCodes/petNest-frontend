import assert from "node:assert/strict";
import test from "node:test";
import { getBrowseResultsSummary } from "../dist-tests/src/features/pets/browseSummary.js";

test("browse results summary formats plural counts and page labels", () => {
  assert.deepEqual(getBrowseResultsSummary(12, 2, 4, true), {
    countLabel: "12 animals found for the current filters.",
    pageLabel: "Page 2 of 4",
    filterLabel: "Filtered results"
  });
});

test("browse results summary handles singular unfiltered copy", () => {
  assert.deepEqual(getBrowseResultsSummary(1, 1, 1, false), {
    countLabel: "1 animal found.",
    pageLabel: "Page 1 of 1",
    filterLabel: "All published listings"
  });
});
