import { motion } from 'framer-motion';
import { EASE } from './fx';
import SectionGridBackdrop from './ui/SectionGridBackdrop';

const INSTAGRAM_URL = 'https://www.instagram.com/careerwithbeni/';

const STATS = [
  { label: 'Posts', value: '119', icon: 'posts' },
  { label: 'Followers', value: '48.5K', icon: 'followers' },
  { label: 'Following', value: '1', icon: 'following' },
] as const;

function StatIcon({ type }: { type: (typeof STATS)[number]['icon'] }) {
  if (type === 'posts') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 text-crimson-2" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  if (type === 'followers') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-crimson-2" aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-crimson-2" aria-hidden>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstagramCard() {
  return (
    <section
      id="instagram"
      aria-label="On Instagram — @careerwithbeni"
      className="relative isolate overflow-hidden bg-ink py-20 sm:py-28"
    >
      {/* Interactive WebGL2 RippleGrid Backdrop tuned to site crimson-ink palette */}
      <SectionGridBackdrop
        eager
        color="#ff3d5a"
        cellSize={48}
        lineWidth={1}
        glow={0.85}
        rippleStrength={1.05}
        autoRipple="center"
        rippleInterval={2.5}
        fade={0.6}
        opacity={0.85}
        edgeFadeHeight="h-28"
        radialGlow="radial-gradient(65% 65% at 50% 50%, rgba(229, 19, 43, 0.16), transparent 72%)"
      />

      {/* Main Glassmorphic Instagram Spotlight Card */}
      <div className="gutter relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: EASE }}
          className="relative overflow-hidden rounded-[28px] border border-crimson-2/40 bg-[#0b0407]/92 shadow-[0_32px_90px_-24px_rgba(229,19,43,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
        >
          {/* Specular crimson top & bottom edge glints matching reference */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[8%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-crimson-2/90 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[12%] right-[8%] h-px bg-gradient-to-r from-transparent via-crimson/80 to-transparent"
          />

          {/* Subtle rotated Instagram watermark on bottom-right */}
          <div
            aria-hidden
            className="pointer-events-none -bottom-10 -right-8 absolute rotate-[-16deg] text-crimson/10"
          >
            <InstagramGlyph className="h-56 w-56 sm:h-72 sm:w-72" />
          </div>

          <div className="relative grid items-stretch gap-6 p-4 sm:p-6 lg:grid-cols-[0.84fr_1.16fr] lg:gap-8 lg:p-6">
            {/* Left Portrait Column with slanted edge framing */}
            <div className="relative flex min-h-[340px] items-end justify-center overflow-hidden rounded-2xl border border-crimson/25 bg-[#12070c] sm:min-h-[400px] lg:min-h-[430px] lg:[clip-path:polygon(0_0,100%_0,87%_100%,0_100%)]">
              {/* Concentric halo arcs behind portrait */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-crimson/25 bg-[radial-gradient(circle,rgba(229,19,43,0.22)_0%,transparent_70%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-crimson-2/20"
              />
              <img
                src="/assets/benita-insta-portrait.jpg"
                alt="Benita Samson (@careerwithbeni)"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 z-[1] h-full w-full object-cover object-[center_18%] transition-transform duration-700 hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#0d070a]/75 via-transparent to-transparent"
              />
            </div>

            {/* Right Editorial & Profile Content Column */}
            <div className="relative z-[1] flex flex-col justify-center px-2 py-2 sm:px-4 sm:py-4 lg:pr-6">
              {/* Eyebrow */}
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-crimson/45" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-mist sm:text-[11px]">
                  Follow My Journey
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-crimson/45" />
              </div>

              {/* Main Title + Gradient Instagram Badge */}
              <div className="mt-5 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <h2 className="font-sans text-[clamp(2rem,4.6vw,3.35rem)] font-extrabold leading-[1.05] tracking-tight text-bone">
                  On{' '}
                  <span className="bg-gradient-to-r from-crimson-2 via-[#fb7185] to-crimson bg-clip-text text-transparent">
                    Instagram
                  </span>
                </h2>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  aria-label="Open @careerwithbeni on Instagram"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-[0_8px_24px_-4px_rgba(238,42,123,0.55)] transition-transform duration-200 hover:scale-105 sm:h-12 sm:w-12"
                >
                  <InstagramGlyph className="h-6 w-6 sm:h-7 sm:w-7" />
                </a>
              </div>

              <p className="mt-2.5 text-sm text-mist sm:text-[15px]">
                Get career insights, guidance, updates and more.
              </p>

              {/* Profile Handle & Name */}
              <div className="mt-5 border-l-2 border-crimson-2 pl-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="group inline-flex items-center gap-2 text-lg font-bold tracking-tight text-bone transition-colors hover:text-crimson-2 sm:text-xl"
                >
                  <span>@careerwithbeni</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-crimson-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                </a>
                <p className="mt-0.5 text-xs font-medium text-mist sm:text-sm">Benita Samson</p>
              </div>

              {/* 3 Stat Pills */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3.5">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2.5 rounded-2xl border border-crimson/25 bg-white/[0.03] px-3 py-3 backdrop-blur-md transition-colors hover:border-crimson/55 sm:gap-3 sm:px-4"
                  >
                    <div className="shrink-0">
                      <StatIcon type={stat.icon} />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="text-base font-bold tracking-tight text-bone sm:text-lg">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-mist sm:text-xs">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio Lines */}
              <div className="mt-5 space-y-1 border-l-2 border-crimson-2 pl-4 text-xs leading-relaxed text-bone/85 sm:text-sm">
                <p>Stop choosing the wrong degree</p>
                <p>Fixing career paths for 5k+ students</p>
                <p className="text-bone/90">
                  India &amp; Abroad <span className="mx-1.5 text-mist/60">|</span> 📩 DM &ldquo;CAREER&rdquo; for your roadmap
                </p>
              </div>

              {/* Follow CTA */}
              <div className="mt-6">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="play"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff3d5a] via-[#e5132b] to-[#9b0d24] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_-8px_rgba(229,19,43,0.65)] transition duration-200 hover:scale-[1.015] hover:shadow-[0_18px_40px_-6px_rgba(255,61,90,0.8)] sm:w-auto sm:min-w-[310px] sm:text-[15px]"
                >
                  <InstagramGlyph className="h-5 w-5 text-white" />
                  <span>Follow on Instagram</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

