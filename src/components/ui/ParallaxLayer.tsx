import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../../lib/gsap';

export type ParallaxLayerProps = {
  children: ReactNode;
  yPercent?: [number, number];
  xPercent?: [number, number];
  scale?: [number, number];
  rotate?: [number, number];
  start?: string;
  end?: string;
  scrub?: number | boolean;
  desktopOnly?: boolean;
  className?: string;
};

/**
 * Dedicated GSAP ScrollTrigger parallax wrapper. Keep separate from elements animated
 * by Framer Motion so transform ownership never collides.
 */
export default function ParallaxLayer({
  children,
  yPercent,
  xPercent,
  scale,
  rotate,
  start = 'top bottom',
  end = 'bottom top',
  scrub = 0.9,
  desktopOnly = false,
  className = '',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const mediaQuery = desktopOnly
        ? '(min-width: 768px) and (prefers-reduced-motion: no-preference)'
        : '(prefers-reduced-motion: no-preference)';

      mm.add(mediaQuery, () => {
        const fromVars: gsap.TweenVars = {};
        const toVars: gsap.TweenVars = {
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub,
          },
        };

        if (yPercent) {
          fromVars.yPercent = yPercent[0];
          toVars.yPercent = yPercent[1];
        }
        if (xPercent) {
          fromVars.xPercent = xPercent[0];
          toVars.xPercent = xPercent[1];
        }
        if (scale) {
          fromVars.scale = scale[0];
          toVars.scale = scale[1];
        }
        if (rotate) {
          fromVars.rotate = rotate[0];
          toVars.rotate = rotate[1];
        }

        gsap.fromTo(el, fromVars, toVars);
      });
    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [
    yPercent?.[0],
    yPercent?.[1],
    xPercent?.[0],
    xPercent?.[1],
    scale?.[0],
    scale?.[1],
    rotate?.[0],
    rotate?.[1],
    start,
    end,
    scrub,
    desktopOnly,
  ]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

