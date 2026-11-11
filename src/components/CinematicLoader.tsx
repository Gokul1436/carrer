import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE } from './fx';

const MIN_LOADER_MS = 1900;
const MAX_WAIT_MS = 4200;
const REVEAL_MS = 900;

function formatTimecode(ms: number) {
  const totalFrames = Math.floor((ms / 1000) * 24);
  const frames = totalFrames % 24;
  const totalSeconds = Math.floor(totalFrames / 24);
  const secs = totalSeconds % 60;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}

/**
 * Cinema-gate preloader:
 * 1) Buffers banner-video-2.mp4, portrait, and web fonts while animating a liquid-fill wordmark + SMPTE HUD.
 * 2) Fires an anamorphic crimson flare and expands a circular optical iris over the live banner video before handing off.
 */
export default function CinematicLoader({ onReady }: { onReady: () => void }) {
  const reduced = useReducedMotionPref();
  const [pct, setPct] = useState(reduced ? 100 : 0);
  const [phase, setPhase] = useState<'loading' | 'reveal'>(reduced ? 'reveal' : 'loading');
  const [elapsedMs, setElapsedMs] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);

  // Track real readiness of banner-video-2.mp4, portrait image, and fonts.
  const readiness = useRef({ video: false, portrait: false, fonts: false });

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onReady();
        }
      }, 320);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    const start = performance.now();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        readiness.current.fonts = true;
      });
    } else {
      readiness.current.fonts = true;
    }

    const img = new Image();
    img.src = profile.portrait.src;
    if (img.complete) {
      readiness.current.portrait = true;
    } else {
      img.onload = () => {
        readiness.current.portrait = true;
      };
      img.onerror = () => {
        readiness.current.portrait = true;
      };
    }

    const vid = videoRef.current;
    const markVideoReady = () => {
      readiness.current.video = true;
    };
    if (vid) {
      if (vid.readyState >= 3) {
        readiness.current.video = true;
      } else {
        vid.addEventListener('canplay', markVideoReady, { once: true });
        vid.addEventListener('loadeddata', markVideoReady, { once: true });
        vid.addEventListener('error', markVideoReady, { once: true });
      }
    }

    let raf = 0;
    let current = 0;
    let revealStarted = false;

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      setElapsedMs(elapsed);

      const r = readiness.current;
      const assetScore = (r.fonts ? 20 : 6) + (r.portrait ? 25 : 8) + (r.video ? 55 : 14);
      const timeProgress = Math.min(100, (elapsed / MIN_LOADER_MS) * 100);
      const allReady = r.fonts && r.portrait && r.video && elapsed >= MIN_LOADER_MS;
      const timedOut = elapsed >= MAX_WAIT_MS;

      const target = allReady || timedOut ? 100 : Math.min(94, assetScore * 0.55 + timeProgress * 0.45);
      current += (target - current) * 0.14;
      if (target === 100 && current > 99.3) current = 100;

      const rounded = Math.min(100, Math.round(current));
      setPct(rounded);

      if (rounded >= 100 && !revealStarted) {
        revealStarted = true;
        setPhase('reveal');
        window.setTimeout(() => {
          if (!cancelled && !doneRef.current) {
            doneRef.current = true;
            onReady();
          }
        }, REVEAL_MS);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (vid) {
        vid.removeEventListener('canplay', markVideoReady);
        vid.removeEventListener('loadeddata', markVideoReady);
        vid.removeEventListener('error', markVideoReady);
      }
    };
  }, [onReady, reduced]);

  const fillInsetTop = Math.max(0, 100 - pct);

  return (
    <motion.div
      className="fixed inset-0 z-[140] overflow-hidden bg-ink"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: EASE }}
      role="status"
      aria-live="polite"
      aria-label={`Loading experience ${pct} percent`}
    >
      {/* Live banner-video-2 layer revealed through an expanding optical iris at 100% */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          clipPath: phase === 'reveal' ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
        }}
        transition={{ duration: REVEAL_MS / 1000, ease: EASE }}
      >
        <video
          ref={videoRef}
          src={profile.bannerVideo}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover brightness-[0.58] contrast-[1.08]"
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(65%_60%_at_50%_50%,rgba(229,19,43,0.16),rgba(7,7,10,0.86)_100%)]" />
      </motion.div>

      {/* Cinema gate projector glow + subtle film-perforation rails */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_50%,rgba(229,19,43,0.16),transparent_72%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[6vh] border-b border-white/[0.06] bg-black/75" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[6vh] border-t border-white/[0.06] bg-black/75" />

      {/* Optical viewfinder corner brackets */}
      <div aria-hidden className="pointer-events-none absolute inset-6 sm:inset-10">
        <span className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-crimson-2/60" />
        <span className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-crimson-2/60" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-crimson-2/60" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-crimson-2/60" />
      </div>

      {/* Top telemetry HUD */}
      <div className="gutter relative z-10 flex items-center justify-between pt-[calc(6vh+14px)] font-sans text-[10px] font-semibold tracking-[0.28em] text-mist/80 sm:text-xs">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-crimson-2 shadow-[0_0_10px_#ff3d5a]" />
          REEL 02 // INITIALIZING
        </span>
        <span className="tabular-nums text-bone/75">{formatTimecode(elapsedMs)}</span>
      </div>

      {/* Centerpiece: liquid-fill typography with rising crimson scanline */}
      <motion.div
        className="relative z-10 flex h-[calc(100svh-12vh-80px)] flex-col items-center justify-center px-4 text-center"
        animate={phase === 'reveal' ? { scale: 1.07, opacity: 0, filter: 'blur(8px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.72, ease: EASE }}
      >
        <div className="relative inline-block select-none">
          {/* Hollow outline base */}
          <span
            aria-hidden
            className="text-outline block font-display leading-[0.82] tracking-[0.06em]"
            style={{ fontSize: 'clamp(4.6rem, 20vw, 15rem)' }}
          >
            {profile.firstName.toUpperCase()}
          </span>

          {/* Clipped liquid-fill bone layer */}
          <span
            aria-hidden
            className="absolute inset-0 block font-display leading-[0.82] tracking-[0.06em] text-bone drop-shadow-[0_0_32px_rgba(229,19,43,0.4)]"
            style={{
              fontSize: 'clamp(4.6rem, 20vw, 15rem)',
              clipPath: `inset(${fillInsetTop}% 0% 0% 0%)`,
            }}
          >
            {profile.firstName.toUpperCase()}
          </span>

          {/* Rising crimson laser scanline along the fill edge */}
          {pct > 1 && pct < 100 && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-[-8%] h-[2px] bg-gradient-to-r from-transparent via-crimson-2 to-transparent shadow-[0_0_18px_rgba(255,61,90,0.95)]"
              style={{ top: `${fillInsetTop}%` }}
            />
          )}
        </div>

        <p className="mt-4 font-sans text-[11px] font-bold tracking-[0.55em] text-crimson-2/90 sm:text-sm">
          {profile.seriesTag}
        </p>

        {/* Precision thin progress rail + percentage */}
        <div className="mt-8 flex w-[min(78vw,320px)] items-center gap-3">
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full bg-gradient-to-r from-crimson via-crimson-2 to-bone shadow-[0_0_12px_rgba(255,61,90,0.8)] transition-[width] duration-75"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="w-11 text-right font-sans text-xs font-semibold tabular-nums tracking-[0.18em] text-bone">
            {String(pct).padStart(3, '0')}%
          </span>
        </div>
      </motion.div>

      {/* Anamorphic horizontal crimson flare on 100% ignition */}
      {phase === 'reveal' && !reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-crimson-2 to-transparent shadow-[0_0_45px_8px_rgba(255,61,90,0.85)]"
          initial={{ scaleX: 0.05, opacity: 0.95 }}
          animate={{ scaleX: [0.05, 1.35, 1.6], opacity: [0.95, 1, 0] }}
          transition={{ duration: 0.75, ease: EASE }}
        />
      )}
    </motion.div>
  );
}
