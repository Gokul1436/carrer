import { useLayoutEffect, useRef } from 'react';
import { achievements, certifications, teamMembers } from '../data/portfolio';
import { SectionHeading, Tilt } from './fx';
import { RailButtons } from './Rail';
import { GSAP_EASE, gsap } from '../lib/gsap';
import ParallaxLayer from './ui/ParallaxLayer';

function Laurel({ side }: { side: 'l' | 'r' }) {
  return (
    <svg viewBox="0 0 30 64" className={`h-14 w-auto text-[#d9b46a] ${side === 'r' ? '-scale-x-100' : ''}`} aria-hidden>
      <path d="M26 62C10 52 4 36 8 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {[10, 18, 26, 34, 42, 50].map((y, i) => (
        <ellipse key={y} cx={i < 2 ? 9 : 8 + i * 1.6} cy={y} rx="5" ry="2.2" fill="currentColor" opacity="0.85" transform={`rotate(-40 ${8 + i * 1.6} ${y})`} />
      ))}
    </svg>
  );
}

export default function Achievements() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const issuers = Array.from(new Set(certifications.map((c) => c.issuer)));

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const awards = el.querySelectorAll<HTMLElement>('[data-award-card]');
        const certs = el.querySelectorAll<HTMLElement>('[data-cert-card]');

        if (awards.length) {
          gsap.fromTo(
            awards,
            { y: 48, opacity: 0, rotateX: 16, transformPerspective: 1200 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.85,
              stagger: 0.08,
              ease: GSAP_EASE,
              scrollTrigger: { trigger: awards[0], start: 'top 86%', once: true },
            },
          );
        }

        if (certs.length) {
          gsap.fromTo(
            certs,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.045,
              ease: GSAP_EASE,
              scrollTrigger: { trigger: certs[0], start: 'top 90%', once: true },
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
    <div ref={wrapRef}>
      <SectionHeading kicker="Ecosystem & People" title="Impact & Ventures" />

      <div className="gutter grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 [perspective:1400px]">
        {achievements.map((a) => (
          <div key={a.id} data-award-card>
            <Tilt max={8} className="group h-full rounded-2xl">
              <article className="relative flex h-full min-h-[340px] flex-col items-center overflow-hidden rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#2a1f10,#0d0b08_60%,#07070a)] px-5 pb-6 pt-8 text-center ring-1 ring-[#d9b46a]/20 transition duration-500 group-hover:ring-[#d9b46a]/60">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b46a]/70 to-transparent" />
                <div aria-hidden className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#d9b46a]/10 blur-3xl transition duration-700 group-hover:bg-[#d9b46a]/25" />
                <div className="relative flex items-center gap-1">
                  <Laurel side="l" />
                  <div className="px-1">
                    <p className="text-[9px] font-bold uppercase leading-tight tracking-[0.24em] text-[#d9b46a]">{a.laurel}</p>
                  </div>
                  <Laurel side="r" />
                </div>
                <h3 className="relative mt-6 font-display text-[2.1rem] leading-[0.92] tracking-wide text-bone">{a.title}</h3>
                <p className="relative mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9b46a]">{a.org}</p>
                <p className="relative mt-4 text-[13px] leading-relaxed text-bone/70">{a.detail}</p>
                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="relative mt-auto inline-flex min-h-10 items-center gap-1 pt-5 text-xs font-semibold tracking-wide text-bone underline decoration-[#d9b46a]/60 underline-offset-4 hover:decoration-[#d9b46a]"
                  >
                    View more ↗
                  </a>
                )}
              </article>
            </Tilt>
          </div>
        ))}
      </div>

      {/* Connecting Dots Ecosystem & Media rail */}
      <div className="mt-16">
        <div className="gutter mb-2 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-sans text-lg font-semibold text-bone sm:text-2xl">
            Connecting Dots Ecosystem <span className="text-mist">· {certifications.length} ventures &amp; media</span>
          </h3>
          <ParallaxLayer xPercent={[-4, 4]} scrub={1} desktopOnly>
            <p className="text-xs text-smoke">{issuers.slice(0, 4).join(' · ')}</p>
          </ParallaxLayer>
        </div>
        <div className="group/rail relative">
          <div ref={rail} className="rail gutter flex snap-x gap-3 overflow-x-auto py-5">
            {certifications.map((c) => (
              <a
                key={c.name}
                data-cert-card
                href={c.link}
                target={c.link.startsWith('http') ? '_blank' : undefined}
                rel={c.link.startsWith('http') ? 'noreferrer' : undefined}
                data-cursor="link"
                className="group relative flex w-[250px] shrink-0 snap-start flex-col justify-between rounded-xl bg-ink-2 p-4 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-white/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-crimson-2">{c.issuer}</span>
                  <span className="text-sm text-smoke transition group-hover:text-bone">↗</span>
                </div>
                <p className="mt-6 text-sm font-medium leading-snug text-bone">{c.name}</p>
              </a>
            ))}
          </div>
          <RailButtons rail={rail} />
        </div>
      </div>

      {/* Leadership & Team (8 today → 15 in the vision) */}
      <div className="gutter mt-14">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-sans text-lg font-semibold text-bone sm:text-2xl">
            Leadership &amp; Team <span className="text-mist">· Eight people today. A team of fifteen in the vision.</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {teamMembers.map((m) => (
            <div key={m.name} className="rounded-xl bg-ink-2 p-4 ring-1 ring-white/10">
              <p className="font-display text-2xl leading-none tracking-wide text-bone">{m.name}</p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson-2">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
