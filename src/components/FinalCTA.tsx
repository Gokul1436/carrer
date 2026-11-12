import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { gsap } from '../lib/gsap';
import GsapSplitText from './ui/GsapSplitText';
import ParallaxLayer from './ui/ParallaxLayer';
import SoftAurora from './ui/SoftAurora';

export default function FinalCTA({ onReplay }: { onReplay: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { scrollTo } = useSmoothScroll();

  useLayoutEffect(() => {
    const section = ref.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          headline,
          { letterSpacing: '0.42em', opacity: 0.2, scale: 1.07, filter: 'blur(12px)' },
          {
            letterSpacing: '0.02em',
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              end: 'top 25%',
              scrub: 0.9,
            },
          },
        );
      });
    }, section);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const ctas = [
    { label: "Connect · Email", href: `mailto:${profile.email}?subject=${encodeURIComponent("Connecting with Benita Samson")}`, primary: true, cursor: 'play' },
    { label: 'Career HQ', href: profile.links.careerhq, cursor: 'link' },
    { label: 'Instagram', href: profile.links.instagram, cursor: 'link' },
    { label: `Call · ${profile.phone}`, href: `tel:${profile.phone}`, cursor: 'link' },
  ];

  return (
    <section id="contact" ref={ref} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-ink">
        <SoftAurora
          speed={0.5}
          scale={1.55}
          brightness={0.95}
          color1="#ff8a9a"
          color2="#e5132b"
          bandHeight={0.45}
          bandSpread={1.15}
          spectrum={0.4}
          tilt={5}
          opacity={0.58}
          enableMouseInteraction
          mouseInfluence={0.24}
        />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(229,19,43,0.16),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink to-transparent" />
      </div>
      <Particles count={36} />

      <motion.p
        className="relative mb-6 text-[11px] font-bold uppercase tracking-[0.5em] text-crimson-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Celebrating the Journey
      </motion.p>
      <ParallaxLayer yPercent={[10, -10]} scrub={1}>
        <h2
          ref={headlineRef}
          className="relative font-display leading-[0.85] text-bone will-change-transform"
          style={{ fontSize: 'clamp(3.2rem, 11vw, 10rem)' }}
        >
          HAPPY BIRTHDAY, BENITA!
        </h2>
      </ParallaxLayer>

      <div className="relative mt-10 max-w-2xl px-2">
        <GsapSplitText
          as="p"
          text={profile.displayName.toUpperCase()}
          mode="reveal"
          stagger={0.07}
          className="font-sans text-2xl font-semibold tracking-[0.2em] text-bone sm:text-3xl"
        />
        <p className="mt-2 text-xs font-semibold tracking-[0.35em] text-mist sm:text-sm">{profile.role.toUpperCase()}</p>
        <p className="mt-5 text-sm leading-relaxed text-bone/75 sm:text-base">
          A celebration of a woman who dared to dream beyond the familiar, found the courage to begin again, and continues to build with purpose. The journey continues.
        </p>
      </div>

      <motion.div
        className="relative mt-10 flex flex-wrap justify-center gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.35 }}
      >
        {ctas.map((c) => (
          <motion.div key={c.label} variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } } }}>
            <Magnetic>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                data-cursor={c.cursor}
                className={`flex min-h-12 items-center gap-2 rounded-full px-7 text-sm font-bold tracking-[0.12em] transition ${
                  c.primary ? 'bg-crimson text-white shadow-[0_0_50px_rgba(229,19,43,0.5)] hover:bg-crimson-2' : 'border border-white/25 text-bone hover:border-bone hover:bg-white/10'
                }`}
              >
                {c.primary && <span>▶</span>}
                {c.label.toUpperCase()}
                {!c.primary && <span className="text-mist">↗</span>}
              </a>
            </Magnetic>
          </motion.div>
        ))}
      </motion.div>

      <div className="relative mt-16 flex flex-wrap justify-center gap-6 text-xs font-semibold tracking-[0.24em] text-smoke">
        <button type="button" onClick={() => scrollTo(0, { offset: 0 })} className="hover:text-bone">
          ↺ WATCH AGAIN
        </button>
        <button type="button" onClick={onReplay} className="hover:text-bone">
          ▶ REPLAY OPENING
        </button>
      </div>

      <footer className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <div className="mb-2 text-base">
          <img
            src="/assets/careerhq-logo.png"
            alt="Career HQ — Connecting Dots Worldwide"
            width={998}
            height={276}
            loading="lazy"
            decoding="async"
            className="h-7 w-auto object-contain opacity-90"
          />
        </div>
        <p className="text-[11px] leading-relaxed text-smoke">
          © {new Date().getFullYear()} {profile.displayName} · Connecting Dots Worldwide · Career HQ ({profile.links.portfolio.replace('https://', '')})
        </p>
      </footer>
    </section>
  );
}
