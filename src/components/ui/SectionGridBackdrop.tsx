import { useEffect, useRef, useState } from 'react';
import RippleGrid, { type AutoRippleMode, type RippleGridVariant } from './RippleGrid';

export type SectionGridBackdropProps = {
  color?: string;
  variant?: RippleGridVariant;
  cellSize?: number;
  lineWidth?: number;
  glow?: number;
  rippleStrength?: number;
  autoRipple?: AutoRippleMode;
  rippleInterval?: number;
  tilt?: number;
  fade?: number;
  opacity?: number;
  radialGlow?: string;
  edgeFadeHeight?: string;
  eager?: boolean;
  className?: string;
};

/**
 * Reusable interactive box-grid section backdrop powered by WebGL2 RippleGrid.
 * Uses a generous IntersectionObserver margin so offscreen sections cleanly release
 * GPU contexts while keeping visible sections silky-smooth and responsive.
 */
export default function SectionGridBackdrop({
  color = '#ff3d5a',
  variant = 'lines',
  cellSize = 48,
  lineWidth = 1,
  glow = 0.72,
  rippleStrength = 0.95,
  autoRipple = 'center',
  rippleInterval = 2.8,
  tilt = 0,
  fade = 0.62,
  opacity = 0.56,
  radialGlow = 'radial-gradient(65% 65% at 50% 50%, rgba(229, 19, 43, 0.14), transparent 72%)',
  edgeFadeHeight = 'h-24 sm:h-28',
  eager = false,
  className = '',
}: SectionGridBackdropProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(eager);

  useEffect(() => {
    if (eager) {
      setMounted(true);
      return;
    }
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setMounted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nearViewport = entries.some((entry) => entry.isIntersecting);
        setMounted(nearViewport);
      },
      { rootMargin: '450px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden bg-ink ${className}`}
    >
      {/* Subtle static CSS fallback grid so initial scroll never pops */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `linear-gradient(to right, ${color}70 1px, transparent 1px), linear-gradient(to bottom, ${color}70 1px, transparent 1px)`,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          maskImage: 'radial-gradient(ellipse 78% 72% at 50% 50%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 78% 72% at 50% 50%, #000 35%, transparent 100%)',
        }}
      />

      {mounted && (
        <RippleGrid
          color={color}
          variant={variant}
          cellSize={cellSize}
          lineWidth={lineWidth}
          glow={glow}
          rippleStrength={rippleStrength}
          autoRipple={autoRipple}
          rippleInterval={rippleInterval}
          tilt={tilt}
          fade={fade}
          opacity={opacity}
        />
      )}

      {radialGlow && <div className="absolute inset-0" style={{ background: radialGlow }} />}
      <div className={`absolute inset-x-0 top-0 bg-gradient-to-b from-ink to-transparent ${edgeFadeHeight}`} />
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent ${edgeFadeHeight}`} />
    </div>
  );
}
