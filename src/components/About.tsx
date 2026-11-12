import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { education, experience, profile } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';
import { GSAP_EASE, gsap } from '../lib/gsap';
import GsapSplitText from './ui/GsapSplitText';
import ParallaxLayer from './ui/ParallaxLayer';

export default function About() {
  const rightColRef = useRef<HTMLDivElement>(null);
  const facts = [
    { k: 'Australian Banking', v: `${education[0].score} · NAB & CBA`, s: 'Walked away to build her own path' },
    { k: 'Madurai Launch', v: experience[2].company, s: 'Feb 2025 · Founding team of 4' },
    { k: 'Shared Brand', v: `${experience[1].company} (with Gandhi)`, s: 'Logo created 15 October 2025' },
    { k: 'Parent Company', v: experience[0].company, s: profile.location },
  ];

  useLayoutEffect(() => {
    const el = rightColRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const factCards = el.querySelectorAll<HTMLElement>('[data-about-fact]');
        const interestPills = el.querySelectorAll<HTMLElement>('[data-about-interest]');

        if (factCards.length) {
          gsap.fromTo(
            factCards,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: GSAP_EASE,
              scrollTrigger: { trigger: factCards[0], start: 'top 88%', once: true },
            },
          );
        }

        if (interestPills.length) {
          gsap.fromTo(
            interestPills,
            { y: 14, opacity: 0, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.55,
              stagger: 0.045,
              ease: GSAP_EASE,
              scrollTrigger: { trigger: interestPills[0], start: 'top 92%', once: true },
            },
          );
        }
      });
    }, el);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <>
      <SectionHeading kicker="The Woman Beyond the Vision" title="Founder Introduction" />
      <div className="gutter grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <ParallaxLayer yPercent={[-6, 6]} desktopOnly className="mx-auto w-full max-w-md lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.2, ease: EASE }}
          >
        <Tilt max={5} className="rounded-2xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,#5a0b1b,#14060a_60%,#07070a)]" />
            <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_28px)]" />
            <img
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              loading="lazy"
              className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-crimson-2">FOUNDER &amp; CEO</p>
                <p className="font-display text-3xl leading-none text-bone">{profile.displayName}</p>
              </div>
              <span className="rounded border border-white/30 px-1.5 text-[10px] font-bold text-bone">VISION → IMPACT</span>
            </div>
          </div>
        </Tilt>
          </motion.div>
        </ParallaxLayer>

        <div ref={rightColRef}>
          <GsapSplitText
            as="p"
            text={`“${profile.quote}”`}
            mode="reveal"
            stagger={0.03}
            duration={0.85}
            className="font-serif text-[clamp(1.6rem,3.2vw,2.6rem)] italic leading-[1.15] text-bone"
          />
          <p className="mt-4 text-sm text-mist">— {profile.fullName}, Founder &amp; CEO</p>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.k} data-about-fact className="bg-ink-2 p-5">
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">{f.k}</dt>
                <dd className="mt-2 text-base font-semibold text-bone">{f.v}</dd>
                <dd className="mt-0.5 text-xs text-mist">{f.s}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">Ecosystem Pillars</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} data-about-interest className="glass rounded-full px-3 py-1.5 text-xs font-medium text-bone">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
