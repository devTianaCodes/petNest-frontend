export function getImageLimitError(selectedCount: number, maxFiles: number) {
  if (selectedCount > maxFiles) {
    return `You can only upload up to ${maxFiles} image${maxFiles === 1 ? "" : "s"}.`;
  }

  return null;
}

export function getImageSelectionError(files: Array<Pick<File, "type" | "size">>, maxFiles: number) {
  const limitError = getImageLimitError(files.length, maxFiles);
  if (limitError) return limitError;
  if (files.some((file) => !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type))) {
    return "Choose JPEG, PNG, GIF, or WebP images.";
  }
  if (files.some((file) => file.size > 5 * 1024 * 1024)) {
    return "Each image must be 5 MB or smaller.";
  }
  return null;
}

export function formatImageSizeKb(size: number) {
  return `${Math.round(size / 1024)} KB`;
}
