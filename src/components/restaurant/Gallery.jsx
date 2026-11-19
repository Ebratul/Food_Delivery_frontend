import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn, imageSrc, thumb } from "../../lib/utils.js";

export default function Gallery({ images = [], name }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const count = images.length;
  const go = useCallback((dir) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightbox, go]);

  if (!count) return null;
  return (
    <div className="flex flex-col gap-3" aria-roledescription="carousel" aria-label={`${name} photos`}>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-[var(--radius-ui)] bg-[var(--surface-2)]">
        <img src={thumb(images[index], "large")} alt={`${name}: photo ${index + 1} of ${count}`} className="h-full w-full object-cover" fetchPriority="high" />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[var(--radius-ui)] bg-ink/60 text-white backdrop-blur hover:bg-ink/80" aria-label="Previous photo"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-[var(--radius-ui)] bg-ink/60 text-white backdrop-blur hover:bg-ink/80" aria-label="Next photo"><ChevronRight className="h-5 w-5" /></button>
          </>
        )}
        <button type="button" onClick={() => setLightbox(true)} className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-[var(--radius-ui)] bg-ink/60 px-3 py-2 text-sm text-white backdrop-blur hover:bg-ink/80">
          <Expand className="h-4 w-4" /> View all {count}
        </button>
      </div>
      {count > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === index}
              className={cn("aspect-[4/3] overflow-hidden rounded-[var(--radius-ui)] border-2 transition-opacity", i === index ? "border-brand-500" : "border-transparent opacity-70 hover:opacity-100")}>
              <img src={thumb(src, "small")} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {lightbox && createPortal(
        <div className="fixed inset-0 z-[120] flex flex-col bg-ink/95 p-4" role="dialog" aria-modal="true" aria-label={`${name} photo viewer`}>
          <div className="flex items-center justify-between text-white">
            <p className="text-sm text-white/70">{index + 1} / {count}</p>
            <button type="button" onClick={() => setLightbox(false)} className="rounded-[var(--radius-ui)] p-2 hover:bg-white/10" aria-label="Close photo viewer"><X className="h-6 w-6" /></button>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <img src={imageSrc(images[index])} alt={`${name}: photo ${index + 1}`} className="max-h-[80vh] max-w-full rounded-[var(--radius-ui)] object-contain" />
            <button type="button" onClick={() => go(-1)} className="absolute left-0 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-ui)] bg-white/10 text-white hover:bg-white/20" aria-label="Previous photo"><ChevronLeft /></button>
            <button type="button" onClick={() => go(1)} className="absolute right-0 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-ui)] bg-white/10 text-white hover:bg-white/20" aria-label="Next photo"><ChevronRight /></button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
