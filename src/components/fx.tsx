import { useEffect, useLayoutEffect, useRef, type ReactNode, type PointerEvent as RPointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';
import { GSAP_EASE, gsap } from '../lib/gsap';
import GsapSplitText from './ui/GsapSplitText';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Wraps a control so it drifts toward the pointer — desktop only. */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  const active = fine && !reduced;

  const onMove = (e: RPointerEvent<HTMLSpanElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className={`inline-flex ${className}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

/** Subtle 3D tilt that follows the pointer by a few degrees. Flat on touch devices. */
export function Tilt({
  children,
  max = 6,
  className = '',
  glare = true,
  ...rest
}: { children: ReactNode; max?: number; className?: string; glare?: boolean } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const active = fine && !reduced;
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useTransform([gx, gy], ([a, b]) => `radial-gradient(circle at ${a} ${b}, rgba(255,255,255,0.16), transparent 55%)`);

  return (
    <motion.div
      {...rest}
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={active ? { rotateX: rx, rotateY: ry, transformPerspective: 1000, ...(rest.style as object) } : rest.style}
      onPointerMove={(e) => {
        if (!active) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
      {active && glare && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-overlay" style={{ background: glareBg }} />
      )}
    </motion.div>
  );
}

/** GSAP ScrollTrigger masked word-by-word reveal for section headings & editorial titles. */
export function RevealText({ text, className = '', delay = 0, as = 'span' }: { text: string; className?: string; delay?: number; as?: 'span' | 'h2' | 'h3' | 'p' }) {
  return <GsapSplitText text={text} as={as} mode="reveal" delay={delay} className={className} />;
}

/** Small kicker + big title used at the top of every section with GSAP line-draw reveal. */
export function SectionHeading({ kicker, title, aside }: { kicker: string; title: string; aside?: ReactNode }) {
  const kickerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = kickerRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const line = el.querySelector<HTMLElement>('[data-kicker-line]');
        const label = el.querySelector<HTMLElement>('[data-kicker-label]');
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.75,
              ease: GSAP_EASE,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
        }
        if (label) {
          gsap.fromTo(
            label,
            { opacity: 0, x: -14 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              delay: 0.1,
              ease: GSAP_EASE,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
        }
      });
    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [kicker]);

  return (
    <div className="gutter mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-9">
      <div>
        <div
          ref={kickerRef}
          className="mb-2 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-crimson-2"
        >
          <span data-kicker-line className="h-px w-8 bg-crimson-2 will-change-transform" />
          <span data-kicker-label>{kicker}</span>
        </div>
        <RevealText as="h2" text={title} className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] tracking-wide text-bone" />
      </div>
      {aside}
    </div>
  );
}

/** Lightweight drifting dust particles on a canvas — pauses when off screen. */
export function Particles({ count = 46, color = '255,90,110', className = '' }: { count?: number; color?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const dots = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: -Math.random() * 0.00028 - 0.00006,
      a: Math.random() * 0.6 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let running = false;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.tw += dt * 0.002;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
        if (d.x < -0.02) d.x = 1.02;
        if (d.x > 1.02) d.x = -0.02;
        const alpha = d.a * (0.6 + 0.4 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [count, color, reduced]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
