import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTrackProgress } from '../hooks/sectionProgress';
import SectionGridBackdrop, { type SectionGridBackdropProps } from './ui/SectionGridBackdrop';

const SCENE_BACKDROPS: Record<string, SectionGridBackdropProps> = {
  about: {
    color: '#ff3d5a',
    cellSize: 48,
    glow: 0.72,
    opacity: 0.54,
    rippleInterval: 2.9,
  },
  picks: {
    color: '#ff3d5a',
    cellSize: 50,
    glow: 0.68,
    opacity: 0.48,
    autoRipple: 'random',
    rippleInterval: 3.1,
  },
  moments: {
    color: '#d9b46a',
    cellSize: 50,
    glow: 0.7,
    opacity: 0.46,
    rippleInterval: 3.0,
    radialGlow: 'radial-gradient(65% 60% at 50% 45%, rgba(217, 180, 106, 0.12), transparent 72%)',
  },
  story: {
    color: '#ff3d5a',
    cellSize: 46,
    glow: 0.72,
    opacity: 0.52,
    rippleInterval: 2.8,
  },
};

/**
 * A section of the series. Fades up out of black with a short blur-to-focus,
 * renders the matching interactive RippleGrid backdrop, and reports viewing progress.
 */
export default function Scene({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useTrackProgress(id, ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const backdrop = SCENE_BACKDROPS[id];

  return (
    <motion.section id={id} ref={ref} style={{ opacity, scale }} className={`relative scroll-mt-16 py-16 sm:py-24 ${className}`}>
      {backdrop && <SectionGridBackdrop {...backdrop} />}
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}
