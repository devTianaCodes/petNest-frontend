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
import { getImageSelectionError } from "../dist-tests/src/features/pets/imageSelection.js";

test("image selection rejects unsupported types and oversized files before upload", () => {
  assert.equal(getImageSelectionError([{ type: "image/png", size: 5 * 1024 * 1024 }], 3), null);
  assert.match(getImageSelectionError([{ type: "image/png", size: 5 * 1024 * 1024 + 1 }], 3), /5 MB/);
  assert.match(getImageSelectionError([{ type: "image/svg+xml", size: 100 }], 3), /JPEG/);
  assert.match(getImageSelectionError(Array(4).fill({ type: "image/jpeg", size: 100 }), 3), /up to 3/);
});
