import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { videoReels, type VideoReel } from '../data/portfolio';
import { useScrollLock } from '../hooks/smoothScroll';
import { EASE } from './fx';

export default function VideoModal({
  reel,
  onClose,
  onSwitch,
  onProgress,
}: {
  reel: VideoReel;
  onClose: () => void;
  onSwitch: (r: VideoReel) => void;
  onProgress?: (id: string, pct: number) => void;
}) {
  useScrollLock(true);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const idx = videoReels.findIndex((r) => r.id === reel.id);
  const prevReel = idx > 0 ? videoReels[idx - 1] : null;
  const nextReel = idx >= 0 && idx < videoReels.length - 1 ? videoReels[idx + 1] : null;

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevReel) onSwitch(prevReel);
      if (e.key === 'ArrowRight' && nextReel) onSwitch(nextReel);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose, onSwitch, prevReel, nextReel]);

  return (
    <motion.div
      className="fixed inset-0 z-[140] flex flex-col bg-black/92 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={reel.title}
    >
      {/* Top Bar */}
      <div
        className="gutter flex h-16 shrink-0 items-center justify-between gap-4 pt-[env(safe-area-inset-top)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-crimson-2">
            {reel.episode} · {reel.meta}
          </p>
          <h2 className="truncate font-display text-2xl leading-none tracking-wide text-bone sm:text-3xl">
            {reel.title}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={!prevReel}
            onClick={() => prevReel && onSwitch(prevReel)}
            aria-label="Previous episode"
            className="hidden h-9 items-center gap-1 rounded-full border border-white/15 px-3 text-xs font-medium text-bone transition hover:border-white/40 disabled:pointer-events-none disabled:opacity-30 sm:inline-flex"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            disabled={!nextReel}
            onClick={() => nextReel && onSwitch(nextReel)}
            aria-label="Next episode"
            className="hidden h-9 items-center gap-1 rounded-full border border-white/15 px-3 text-xs font-medium text-bone transition hover:border-white/40 disabled:pointer-events-none disabled:opacity-30 sm:inline-flex"
          >
            Next ›
          </button>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            data-cursor="close"
            aria-label="Close video"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-bone transition hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Vertical Reel Player Frame */}
      <div className="gutter flex flex-1 items-center justify-center pb-6 pt-2">
        <motion.div
          key={reel.id}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[min(80vh,760px)] aspect-[9/16] max-w-[92vw] items-center justify-center overflow-hidden rounded-2xl bg-black ring-1 ring-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        >
          <video
            key={reel.videoUrl}
            src={reel.videoUrl}
            poster={reel.posterUrl}
            controls
            autoPlay
            playsInline
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration > 0) {
                onProgress?.(reel.id, Math.min(1, v.currentTime / v.duration));
              }
            }}
            onEnded={() => {
              onProgress?.(reel.id, 1);
              if (nextReel) onSwitch(nextReel);
            }}
            className="h-full w-full object-contain"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
