export function getImageLimitError(selectedCount: number, maxFiles: number) {
  if (selectedCount > maxFiles) {
    return `You can only upload up to ${maxFiles} image${maxFiles === 1 ? "" : "s"}.`;
  }

  return null;
}

export function formatImageSizeKb(size: number) {
  return `${Math.round(size / 1024)} KB`;
}
