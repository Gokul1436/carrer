import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { videoReels, type VideoReel } from '../data/portfolio';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE, RevealText } from './fx';
import { PosterBackdrop } from './Poster';

export default function ContinueWatching({
  onSelect,
  progressMap = {},
  paused = false,
}: {
  onSelect: (reel: VideoReel) => void;
  progressMap?: Record<string, number>;
  paused?: boolean;
}) {
  const reduced = useReducedMotionPref();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isHoveringTrack, setIsHoveringTrack] = useState(false);
  const [brokenImg, setBrokenImg] = useState<Record<string, boolean>>({});
  const [brokenVid, setBrokenVid] = useState<Record<string, boolean>>({});

  const setRef = useRef<HTMLDivElement>(null);
  const halfWidthRef = useRef(0);
  const x = useMotionValue(0);
  const speedRef = useRef(46);

  useEffect(() => {
    const measure = () => {
      if (setRef.current) {
        halfWidthRef.current = setRef.current.offsetWidth;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (setRef.current) ro.observe(setRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduced || !halfWidthRef.current) return;
    const clampedDelta = Math.min(delta, 50);
    const targetSpeed = isHoveringTrack || paused ? 0 : 46;
    // Smoothly brake on hover and accelerate when leaving
    speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, clampedDelta * 0.008);

    if (speedRef.current < 0.2) return;
    let next = x.get() - (speedRef.current * clampedDelta) / 1000;
    if (next <= -halfWidthRef.current) {
      next += halfWidthRef.current;
    }
    x.set(next);
  });

  const renderCard = (reel: VideoReel, copyKey: string) => {
    const key = `${copyKey}-${reel.id}`;
    const isHovered = hoveredId === key;
    const watchedPct = progressMap[reel.id] ?? 0;

    return (
      <motion.button
        key={key}
        type="button"
        data-cursor="play"
        onClick={() => onSelect(reel)}
        onHoverStart={() => setHoveredId(key)}
        onHoverEnd={() => setHoveredId(null)}
        onFocus={() => setHoveredId(key)}
        onBlur={() => setHoveredId(null)}
        whileHover={{ y: -10, scale: 1.035 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="group relative flex w-[200px] shrink-0 flex-col text-left sm:w-[236px] lg:w-[264px]"
      >
        {/* Tall 9:16 Vertical Reel Card so faces are never cropped */}
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-ink-2 ring-1 ring-white/12 transition-all duration-500 group-hover:ring-crimson-2/75 group-hover:shadow-[0_26px_65px_-12px_rgba(229,19,43,0.42),0_0_0_1px_rgba(255,61,90,0.45)]">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.07 : 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <PosterBackdrop palette={reel.palette}>
              {!brokenImg[reel.id] && (
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  loading="lazy"
                  onError={() => setBrokenImg((prev) => ({ ...prev, [reel.id]: true }))}
                  className="h-full w-full object-cover object-top opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
              {isHovered && !reduced && !paused && !brokenVid[reel.id] && (
                <video
                  src={reel.previewUrl}
                  poster={reel.posterUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setBrokenVid((prev) => ({ ...prev, [reel.id]: true }))}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              )}
              {/* Bottom readability gradient keeping the upper face completely clear */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent"
              />
            </PosterBackdrop>
          </motion.div>

          {/* Subtle sheen sweep on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-full rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
          />

          {/* Top Episode Badge & Play Button */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3.5">
            <span className="rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-bone backdrop-blur-md">
              {reel.episode}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/45 text-xs text-bone backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
              ▶
            </span>
          </div>

          {/* Bottom Title & Metadata */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="block font-display text-2xl leading-[0.95] tracking-wide text-bone transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[1.75rem]">
              {reel.title}
            </span>
            <span className="mt-1.5 block text-[11px] font-medium text-mist transition-colors group-hover:text-bone/90">
              {reel.meta}
            </span>
          </div>
        </div>

        {/* Watch Progress Indicator */}
        <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/12">
          <motion.div
            className="h-full origin-left bg-crimson"
            animate={{ scaleX: Math.max(0.08, watchedPct) }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </motion.button>
    );
  };

  return (
    <section id="reels" aria-label="Continue Exploring" className="relative z-10 -mt-8 pb-14 sm:-mt-14 sm:pb-20">
      <div className="gutter mb-5 flex items-end justify-between gap-4">
        <RevealText
          as="h2"
          text="Continue Exploring"
          className="font-sans text-lg font-semibold tracking-tight text-bone sm:text-2xl"
        />
        <span className="hidden text-xs text-smoke sm:block">Hover to pause · Click any reel to watch</span>
      </div>

      {/* Continuous Auto-Scrolling Carousel with Edge Fade */}
      <div
        className={`relative overflow-hidden py-4 ${
          reduced
            ? 'rail gutter flex gap-4 overflow-x-auto'
            : '[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]'
        }`}
        onPointerEnter={() => setIsHoveringTrack(true)}
        onPointerLeave={() => setIsHoveringTrack(false)}
      >
        {reduced ? (
          videoReels.map((reel) => renderCard(reel, 'static'))
        ) : (
          <motion.div style={{ x }} className="flex w-max items-stretch will-change-transform">
            <div ref={setRef} className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-6 sm:pr-6">
              {videoReels.map((reel) => renderCard(reel, 'a'))}
            </div>
            <div aria-hidden className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-6 sm:pr-6">
              {videoReels.map((reel) => renderCard(reel, 'b'))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
