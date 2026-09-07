import { useEffect, useId, useState } from "react";
import { formatImageSizeKb, getImageSelectionError } from "./imageSelection";

type SelectedImage = {
  file: File;
  previewUrl: string;
};

export function ImageUploader({
  onUpload,
  isUploading: externalIsUploading = false,
  maxFiles = 3
}: {
  onUpload: (files: File[]) => Promise<void>;
  isUploading?: boolean;
  maxFiles?: number;
}) {
  const inputId = useId();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<SelectedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadPending = isUploading || externalIsUploading;

  useEffect(() => {
    const nextPreviews = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPreviews(nextPreviews);
    return () => {
      nextPreviews.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    };
  }, [files]);

  function resetSelection(nextFiles: File[]) {
    setFiles(nextFiles);
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-ink">Pet photos</h2>
      <label htmlFor={inputId} className="mt-2 block text-sm text-stone-600">Upload up to {maxFiles} clear images so adopters can understand the pet. JPEG, PNG, GIF, or WebP, up to 5 MB each.</label>
      <div className="mt-4 space-y-4">
        <input
          id={inputId}
          type="file"
          className="block w-full min-w-0 max-w-full text-sm"
          accept="image/jpeg,image/png,image/gif,image/webp"
          disabled={uploadPending}
          aria-describedby={error ? `${inputId}-error` : undefined}
          multiple
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            event.target.value = "";
            const limitError = getImageSelectionError(selected, maxFiles);
            if (limitError) {
              setError(limitError);
              return;
            }

            setError(null);
            resetSelection(selected);
          }}
        />
        {files.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {previews.map((selectedImage) => (
              <div key={selectedImage.previewUrl} className="overflow-hidden rounded-2xl border border-stone-200">
                <img src={selectedImage.previewUrl} alt={selectedImage.file.name} className="h-40 w-full object-cover" />
                <div className="space-y-3 p-3 text-sm text-stone-700">
                  <div>
                    <p className="truncate font-medium text-ink">{selectedImage.file.name}</p>
                    <p>{formatImageSizeKb(selectedImage.file.size)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={uploadPending}
                    aria-label={`Remove ${selectedImage.file.name}`}
                    className="rounded-full border border-stone-200 px-3 py-2 text-xs font-medium text-ink"
                    onClick={() => {
                      setError(null);
                      setFiles((currentFiles) => currentFiles.filter((file) => file !== selectedImage.file));
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {error ? <p id={`${inputId}-error`} role="alert" className="text-sm text-rose-700">{error}</p> : null}
        <button
          type="button"
          disabled={!files.length || uploadPending}
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
          onClick={async () => {
            const selectionError = getImageSelectionError(files, maxFiles);
            if (selectionError) {
              setError(selectionError);
              return;
            }
            setIsUploading(true);
            setError(null);
            try {
              await onUpload(files);
              resetSelection([]);
            } catch (uploadError) {
              setError(uploadError instanceof Error ? uploadError.message : "Images could not be uploaded.");
            } finally {
              setIsUploading(false);
            }
          }}
        >
          {uploadPending ? "Uploading..." : "Upload images"}
        </button>
      </div>
    </section>
  );
}
