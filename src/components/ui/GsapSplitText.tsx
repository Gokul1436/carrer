import { useLayoutEffect, useRef } from 'react';
import { GSAP_EASE, gsap } from '../../lib/gsap';

export type GsapSplitTextProps = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  mode?: 'reveal' | 'scrub' | 'immediate';
  stagger?: number;
  duration?: number;
  delay?: number;
  yPercent?: number;
  start?: string;
  end?: string;
  className?: string;
};

/**
 * GSAP ScrollTrigger masked split-word typography animation.
 * Preserves accessibility with aria-label on the heading and aria-hidden on word masks.
 */
export default function GsapSplitText({
  text,
  as: Tag = 'span',
  mode = 'reveal',
  stagger = 0.055,
  duration = 0.85,
  delay = 0,
  yPercent = 112,
  start = 'top 88%',
  end = 'top 42%',
  className = '',
}: GsapSplitTextProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const words = text.split(' ');

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const wordNodes = el.querySelectorAll<HTMLElement>('[data-gsap-word]');
      if (!wordNodes.length) return;

      mm.add(
        {
          motionOk: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (context.conditions?.reduced) {
            gsap.set(wordNodes, { clearProps: 'transform,opacity,filter' });
            return;
          }

          if (mode === 'immediate') {
            gsap.fromTo(
              wordNodes,
              { yPercent, opacity: 0, rotateZ: 1.5, filter: 'blur(6px)' },
              {
                yPercent: 0,
                opacity: 1,
                rotateZ: 0,
                filter: 'blur(0px)',
                duration,
                stagger,
                delay,
                ease: GSAP_EASE,
                clearProps: 'filter',
              },
            );
            return;
          }

          if (mode === 'scrub') {
            gsap.fromTo(
              wordNodes,
              { yPercent: yPercent * 0.45, opacity: 0.2 },
              {
                yPercent: 0,
                opacity: 1,
                stagger: stagger * 0.7,
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start,
                  end,
                  scrub: 0.85,
                },
              },
            );
            return;
          }

          gsap.fromTo(
            wordNodes,
            { yPercent, opacity: 0, rotateZ: 1.4, filter: 'blur(6px)' },
            {
              yPercent: 0,
              opacity: 1,
              rotateZ: 0,
              filter: 'blur(0px)',
              duration,
              stagger,
              delay,
              ease: GSAP_EASE,
              clearProps: 'filter',
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
              },
            },
          );
        },
      );
    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [text, mode, stagger, duration, delay, yPercent, start, end]);

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        rootRef.current = node;
      }}
      className={className}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span data-gsap-word className="inline-block will-change-transform">
            {w}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}

