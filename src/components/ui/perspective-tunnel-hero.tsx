import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { profile, videoReels, type VideoReel } from '@/data/portfolio';
import { useFinePointer, useReducedMotionPref } from '@/hooks/useMedia';
import { PosterBackdrop } from '@/components/Poster';

interface TunnelCardData {
  reel: VideoReel;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const TUNNEL_CARDS: TunnelCardData[] = videoReels.map((reel, i) => {
  const goldenAngle = i * 137.5 * (Math.PI / 180);
  const radiusFactorX = 0.28 + (i % 3) * 0.08;
  const radiusFactorY = 0.25 + (i % 2) * 0.08;

  return {
    reel,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX,
    radiusFactorY,
    rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 4) * 2),
    index: i,
  };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
  onSelect?: (reel: VideoReel) => void;
}

function TunnelCard({ card, progress, pointer, total, stage, onSelect }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 340 : 480;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.16, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(176, stage.width * 0.38))
    : Math.max(175, Math.min(255, stage.width * 0.17));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 18 : 42;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]: number[]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    },
  );

  return (
    <motion.button
      type="button"
      data-cursor="play"
      onClick={() => onSelect?.(card.reel)}
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      aria-label={`Watch ${card.reel.title}`}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[9/16] cursor-pointer select-none text-left will-change-transform"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-ink-2 shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/15 transition-all duration-500 hover:ring-crimson-2/75 hover:shadow-[0_25px_70px_rgba(229,19,43,0.35)]">
        <PosterBackdrop palette={card.reel.palette}>
          <img
            src={card.reel.posterUrl}
            alt={card.reel.title}
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </PosterBackdrop>

        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/90 via-black/15 to-transparent p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-bone backdrop-blur-md">
              {card.reel.episode}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/50 text-[10px] text-bone backdrop-blur-md transition group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
              ▶
            </span>
          </div>

          <div>
            <span className="block font-display text-xl leading-[0.95] tracking-wide text-bone sm:text-2xl">
              {card.reel.title}
            </span>
            <span className="mt-1 block text-[10px] font-medium tracking-wider text-mist">
              {card.reel.meta}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function PerspectiveTunnelHero({
  onSelect,
}: {
  onSelect?: (reel: VideoReel) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionPref();
  const fine = useFinePointer();

  const [stage, setStage] = useState<StageDimensions>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.0001,
  });

  const pointer = useCameraParallax(!reduce && fine);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 1.28]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.14, 0.85, 1], [0.35, 1, 1, 0]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.16], [1, 0]);

  if (reduce) {
    return (
      <section id="showcase" className="gutter py-16">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.35em] text-crimson-2">
          {profile.firstName} · 3D Showcase
        </p>
        <h2 className="mb-8 font-display text-5xl tracking-wide text-bone">INTO THE FRAME.</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {videoReels.map((reel) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => onSelect?.(reel)}
              className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-ink-2 text-left ring-1 ring-white/15"
            >
              <img
                src={reel.posterUrl}
                alt={reel.title}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4">
                <span className="font-display text-xl text-bone">{reel.title}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="showcase"
      ref={wrapRef}
      aria-label="3D Spatial Reel Showcase"
      className="relative h-[240vh] w-full"
    >
      <div
        className="sticky top-0 flex h-[100svh] w-full select-none items-center justify-center overflow-hidden bg-ink text-bone"
        style={{
          perspective: stage.isMobile ? '900px' : '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Clean Crimson Radial Spotlight without background line/grid overlays */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,19,43,0.22)_0%,transparent_70%)]"
        />

        {/* Top & Bottom Soft Vignettes for Seamless Page Blending */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />

        {/* Central Anchor Typography */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none z-0 flex max-w-xl flex-col items-center px-6 text-center"
        >
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.42em] text-crimson-2">
            {profile.firstName} · Reel Archive
          </p>
          <h2 className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.86] tracking-wide text-bone">
            INTO THE
            <br />
            <span className="shimmer-text">FRAME.</span>
          </h2>
          <p className="mt-4 max-w-[36ch] text-sm font-light text-mist sm:text-base">
            Scroll to fly through the 3D showcase — click any reel to watch.
          </p>
        </motion.div>

        {/* Scroll Prompt */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-smoke"
        >
          <span>Scroll to Fly Through</span>
          <div className="h-6 w-px bg-gradient-to-b from-crimson to-transparent" />
        </motion.div>

        {/* 3D Z-Space Plane */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {TUNNEL_CARDS.map((card) => (
            <TunnelCard
              key={card.reel.id}
              card={card}
              progress={smoothProgress}
              pointer={pointer}
              total={TUNNEL_CARDS.length}
              stage={stage}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

