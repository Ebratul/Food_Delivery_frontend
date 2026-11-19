import { useRef, useState } from "react";
import { ImagePlus, Link2, X } from "lucide-react";
import { toast } from "sonner";
import { errorMessage, upload } from "../../lib/api.js";
import { cn, thumb } from "../../lib/utils.js";
import Spinner from "../ui/Spinner.jsx";

const MAX_MB = 4;

/** Upload images (stored by the API) or paste an image URL. value: string[] */
export default function ImageUploader({ value = [], onChange, max = 8, error, label = "Photos" }) {
  const input = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const addFiles = async (files) => {
    const list = [...files].slice(0, max - value.length);
    if (!list.length) return;
    setUploading(true);
    const added = [];
    for (const file of list) {
      if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image`); continue; }
      if (file.size > MAX_MB * 1024 * 1024) { toast.error(`${file.name} is larger than ${MAX_MB} MB`); continue; }
      try {
        const res = await upload("/uploads", file);
        added.push(res.data.url);
      } catch (err) { toast.error(errorMessage(err)); }
    }
    setUploading(false);
    if (added.length) onChange([...value, ...added]);
  };

  const addUrl = () => {
    const v = url.trim();
    if (!/^https?:\/\/.+/i.test(v)) { toast.error("Enter a valid image URL starting with http(s)://"); return; }
    onChange([...value, v]);
    setUrl("");
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label} <span className="text-accent-600" aria-hidden="true">*</span></p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={src} className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-ui)] border border-ui">
            <img src={thumb(src, "small")} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-2 top-2 rounded-md bg-ink/70 px-2 py-0.5 text-xs text-white">Cover</span>}
            <button type="button" onClick={() => onChange(value.filter((v) => v !== src))} className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-ink/70 text-white hover:bg-red-600" aria-label={`Remove photo ${i + 1}`}>
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" onClick={() => input.current?.click()} disabled={uploading}
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className={cn("flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[var(--radius-ui)] border-2 border-dashed text-sm text-muted transition-colors hover:border-brand-400 hover:text-brand-600", error ? "border-red-500" : "border-ui")}>
            {uploading ? <Spinner /> : <ImagePlus className="h-6 w-6" />}
            {uploading ? "Uploading…" : "Upload photo"}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} aria-label="Choose photos to upload" />
      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste an image URL" aria-label="Image URL"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
            className="h-10 w-full rounded-[var(--radius-ui)] border border-ui bg-[var(--surface)] pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none" />
        </div>
        <button type="button" onClick={addUrl} className="h-10 rounded-[var(--radius-ui)] border border-ui px-4 text-sm hover:border-brand-400">Add</button>
      </div>
      <p className="mt-2 text-xs text-muted">JPG, PNG, WebP or AVIF up to {MAX_MB} MB. The first photo is used as the cover. {value.length}/{max}</p>
      {error && <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
