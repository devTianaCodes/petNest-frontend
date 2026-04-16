import assert from "node:assert/strict";
import test from "node:test";
import { formatImageSizeKb, getImageLimitError } from "../dist-tests/src/features/pets/imageSelection.js";

test("image selection enforces max file count", () => {
  assert.equal(getImageLimitError(4, 3), "You can only upload up to 3 images.");
  assert.equal(getImageLimitError(2, 3), null);
  assert.equal(getImageLimitError(2, 1), "You can only upload up to 1 image.");
});

test("image size formatter rounds to kilobytes", () => {
  assert.equal(formatImageSizeKb(1024), "1 KB");
  assert.equal(formatImageSizeKb(1536), "2 KB");
});
