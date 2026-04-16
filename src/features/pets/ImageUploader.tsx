import { useEffect, useState } from "react";

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
  const [files, setFiles] = useState<SelectedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    };
  }, [files]);

  function resetSelection(nextFiles: File[]) {
    setFiles((currentFiles) => {
      currentFiles.forEach((file) => URL.revokeObjectURL(file.previewUrl));
      return nextFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
    });
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-ink">Pet photos</h2>
      <p className="mt-2 text-sm text-stone-600">Upload up to {maxFiles} clear images so adopters can understand the pet.</p>
      <div className="mt-4 space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            if (selected.length > maxFiles) {
              setError(`You can only upload up to ${maxFiles} image${maxFiles === 1 ? "" : "s"}.`);
              return;
            }

            setError(null);
            resetSelection(selected);
            event.target.value = "";
          }}
        />
        {files.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {files.map((selectedImage) => (
              <div key={selectedImage.file.name} className="overflow-hidden rounded-2xl border border-stone-200">
                <img src={selectedImage.previewUrl} alt={selectedImage.file.name} className="h-40 w-full object-cover" />
                <div className="space-y-3 p-3 text-sm text-stone-700">
                  <div>
                    <p className="truncate font-medium text-ink">{selectedImage.file.name}</p>
                    <p>{Math.round(selectedImage.file.size / 1024)} KB</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-stone-200 px-3 py-2 text-xs font-medium text-ink"
                    onClick={() => {
                      setError(null);
                      setFiles((currentFiles) => {
                        const nextFiles = currentFiles.filter((file) => file.file !== selectedImage.file);
                        URL.revokeObjectURL(selectedImage.previewUrl);
                        return nextFiles;
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button
          type="button"
          disabled={!files.length || externalIsUploading}
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
          onClick={async () => {
            try {
              await onUpload(files.map((file) => file.file));
              resetSelection([]);
            } catch (uploadError) {
              setError((uploadError as Error).message);
            }
          }}
        >
          {externalIsUploading ? "Uploading..." : "Upload images"}
        </button>
      </div>
    </section>
  );
}
