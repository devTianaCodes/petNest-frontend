import { useState } from "react";

export function ImageUploader({
  onUpload
}: {
  onUpload: (files: File[]) => Promise<void>;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-ink">Pet photos</h2>
      <p className="mt-2 text-sm text-stone-600">Upload up to 3 clear images so adopters can understand the pet.</p>
      <div className="mt-4 space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            if (selected.length > 3) {
              setError("You can only upload up to 3 images.");
              return;
            }

            setError(null);
            setFiles(selected);
          }}
        />
        {files.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {files.map((file) => (
              <div key={file.name} className="rounded-2xl border border-stone-200 p-3 text-sm text-stone-700">
                {file.name}
              </div>
            ))}
          </div>
        ) : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        <button
          type="button"
          disabled={!files.length || isUploading}
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
          onClick={async () => {
            setIsUploading(true);
            try {
              await onUpload(files);
              setFiles([]);
            } finally {
              setIsUploading(false);
            }
          }}
        >
          {isUploading ? "Uploading..." : "Upload images"}
        </button>
      </div>
    </section>
  );
}
