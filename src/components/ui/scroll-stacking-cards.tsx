'use client';

import { useRef, type ReactNode } from 'react';
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { projects as portfolioProjects, type Project as PortfolioProject } from '@/data/portfolio';
import { ProjectArt } from '@/components/Poster';
import { useFinePointer, useReducedMotionPref } from '@/hooks/useMedia';
import SectionGridBackdrop from './SectionGridBackdrop';

export type Project = {
  id?: string;
  name: string;
  /** One sentence for screen readers: what the site is. */
  summary: string;
  url: string;
  /** Short address shown on the button when the real one is long (or a short label). */
  display?: string;
  /** A screenshot of the site, ideally 16:9. Optional when pairing with a portfolio project preview. */
  image?: string;
  /** The arrow button colour, from the site's own brand. */
  accent: string;
  /** Optional rich portfolio project backing the live preview frame. */
  portfolio?: PortfolioProject;
  /** Optional tag pills shown inside the synthetic preview frame when `image` is omitted. */
  tags?: string[];
};

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

/** 6 Core Pillars from PDF Page 3 */
const CAREER_HQ_AREAS = [
  {
    title: 'STUDY IN INDIA',
    desc: 'University admissions and domestic education guidance.',
  },
  {
    title: 'STUDY ABROAD',
    desc: 'International education and overseas admissions.',
  },
  {
    title: 'TRAINING & PLACEMENT',
    desc: 'Professional development and Indian employment opportunities.',
  },
  {
    title: 'MBBS ADMISSIONS',
    desc: 'Medical education admission assistance in India and abroad.',
  },
  {
    title: 'EDUCATION LOAN SUPPORT',
    desc: 'Financial guidance and education loan assistance.',
  },
  {
    title: 'SCHOLARSHIP SUPPORT',
    desc: 'Scholarship guidance and funding opportunities.',
  },
];

/** Dedicated Portfolio Object for Slide 3 (Media & Content Ventures) */
const MEDIA_VENTURES_PORTFOLIO: PortfolioProject = {
  id: 'media-content-ventures',
  title: 'Media & Content Ventures',
  year: 'Upcoming • YouTube',
  genre: 'Upcoming • YouTube Channel & Documentary Show',
  logline:
    "Alongside her education and entrepreneurial work, Benita's wider vision includes media and knowledge-sharing platforms that bring stories, experience and perspectives to a wider audience.",
  stack: ['Mic & Mentors', 'TRP – The Reality Project', 'Upcoming YouTube Channel', 'Founder Interviews', 'Documentary Show'],
  build: [
    'Mic & Mentors is an upcoming interview-led YouTube channel featuring founders, CEOs, industry experts and experienced professionals.',
    'TRP – The Reality Project is a documentary-style show concept built around real people, overlooked professions and everyday stories that deserve to be seen and heard.',
  ],
  features: [
    'Mic & Mentors — Upcoming interview-led YouTube channel',
    'TRP – The Reality Project — Documentary show inside Mic & Mentors',
    'Interviews featuring founders, CEOs and industry experts',
    'Documentary storytelling around overlooked professions and everyday people',
  ],
  metrics: [
    { value: 'YouTube', label: 'Flagship Platform' },
    { value: 'Leaders', label: 'Founders & CEOs' },
    { value: 'TRP Show', label: 'Documentary Concept' },
    { value: 'Stories', label: 'Everyday Professions' },
  ],
  externalUrl: 'https://www.instagram.com/careerwithbeni/',
  externalLabel: 'Follow @careerwithbeni',
  palette: { from: '#051829', via: '#0c4d75', to: '#040b12', accent: '#38bdf8' },
  motif: 'tenants',
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'career-hq',
    name: 'Career HQ',
    summary: 'Two Journeys • One Shared Brand — The Birth of Career HQ',
    url: 'https://www.careerhq.in',
    display: 'www.careerhq.in',
    accent: '#ff3d5a',
    portfolio: portfolioProjects[0],
  },
  {
    id: 'career-with-beni',
    name: 'Career with Beni',
    summary: 'Instagram • Personal Brand — 50,000+ Followers & 120+ Videos',
    url: 'https://www.instagram.com/careerwithbeni/',
    display: 'instagram.com/careerwithbeni',
    accent: '#ffb547',
    portfolio: portfolioProjects[1],
  },
  {
    id: 'media-content-ventures',
    name: 'Media & Content',
    summary: 'Upcoming • YouTube — Mic & Mentors and TRP – The Reality Project',
    url: 'https://www.instagram.com/careerwithbeni/',
    display: 'Upcoming on YouTube',
    accent: '#38bdf8',
    portfolio: MEDIA_VENTURES_PORTFOLIO,
  },
];

export type ProjectDeckProps = {
  projects?: Project[];
  /** The page ground; the cut-out corner that holds the visit button is filled with it. */
  ground?: string;
  className?: string;
  children?: ReactNode;
  /** Optional callback when a project card without an external URL (or matching a modal project) is activated. */
  onOpenProject?: (project: PortfolioProject) => void;
};

export function ProjectDeck({
  projects = DEFAULT_PROJECTS,
  ground = '#07070a',
  className,
  children,
  onOpenProject,
}: ProjectDeckProps) {
  const deck = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion() ?? false;
  const count = projects.length;
  const { scrollYProgress } = useScroll({ target: deck, offset: ['start start', 'end end'] });
  // Light, critically damped smoothing: follows scroll closely without overshooting
  const progress = useSpring(scrollYProgress, { stiffness: 380, damping: 48, mass: 0.35 });

  return (
    <MotionConfig reducedMotion="user">
      {/* One screen of scroll per card; the stage stays pinned while they are dealt onto it */}
      <section
        id="deck"
        ref={deck}
        className={cn('relative w-full', className)}
        style={{ height: `${Math.max(1, count) * 100}svh`, background: ground }}
        aria-label="Featured Productions Deck"
      >
        {/* Subtle ambient crimson stage glow matching site theme */}
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 z-0 h-0 w-full overflow-visible"
        >
          <div className="h-[60vh] w-full bg-[radial-gradient(60%_50%_at_50%_15%,rgba(229,19,43,0.10),transparent_70%)]" />
        </div>

        <div className="sticky top-0 grid h-[100svh] place-items-center overflow-x-clip px-3 [perspective:1800px] sm:px-6 lg:px-10">
          {/* Interactive tilted crimson studio box-grid backdrop */}
          <SectionGridBackdrop
            color="#e5132b"
            cellSize={54}
            tilt={24}
            glow={0.7}
            opacity={0.52}
            rippleInterval={3.1}
            radialGlow="radial-gradient(60% 50% at 50% 25%, rgba(229,19,43,0.12), transparent 70%)"
          />

          {/* Top section kicker floating above the dealt deck */}
          <div className="pointer-events-none absolute inset-x-0 top-5 z-10 flex justify-center sm:top-7">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-mist/80 sm:text-[11px]">
              <span className="h-px w-6 bg-crimson" />
              Featured Productions · 3D Interactive Deck
              <span className="h-px w-6 bg-crimson" />
            </p>
          </div>

          {projects.map((p, i) => (
            <Card
              key={p.id ?? p.url + p.name}
              p={p}
              i={i}
              count={count}
              progress={progress}
              still={reduce}
              ground={ground}
              onOpenProject={onOpenProject}
            />
          ))}
        </div>
      </section>
      {children}
    </MotionConfig>
  );
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const ENTER = 0.72; // share of each card's screen spent arriving; the rest it rests in place

/** How far card `j` has arrived (0 below the window, 1 landed) at deck progress `v`. */
function arrived(j: number, v: number, count: number) {
  if (j <= 0) return 1;
  const span = Math.max(1, count - 1);
  return easeOut(clamp01((v * span - (j - 1)) / ENTER));
}

function Card({
  p,
  i,
  count,
  progress,
  still,
  ground,
  onOpenProject,
}: {
  p: Project;
  i: number;
  count: number;
  progress: MotionValue<number>;
  still: boolean;
  ground: string;
  onOpenProject?: (project: PortfolioProject) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const activeMouse = fine && !reduced;

  // Mouse tilt variables for card-level subtle perspective
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const tiltSpring = { stiffness: 180, damping: 24, mass: 0.5 };
  const cardRotateX = useSpring(useTransform(my, [0, 1], [4, -4]), tiltSpring);
  const cardRotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), tiltSpring);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeMouse || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mx.set(Math.max(0, Math.min(1, x)));
    my.set(Math.max(0, Math.min(1, y)));
  };

  const onPointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  // Cards currently lying on top of this one, counted smoothly
  const above = (v: number) => {
    let n = 0;
    for (let j = i + 1; j < count; j++) n += arrived(j, v, count);
    return Math.min(3, n);
  };

  const scrollY = useTransform(progress, (v) => `${(1 - arrived(i, v, count)) * 108 - above(v) * 5}svh`);
  const scrollRotateX = useTransform(progress, (v) => -(1 - arrived(i, v, count)) * 30 + above(v) * 5);
  const scale = useTransform(progress, (v) => 0.9 + 0.1 * arrived(i, v, count) - above(v) * 0.05);
  const filter = useTransform(
    progress,
    (v) => `blur(${((1 - arrived(i, v, count)) ** 2 * 12 + above(v) * 1.1).toFixed(2)}px)`,
  );
  const dim = useTransform(progress, (v) => above(v) * 0.22);
  const stillY = useTransform(progress, (v) => (arrived(i, v, count) >= 0.5 ? '0svh' : '110svh'));

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label={`${p.name}: ${p.summary}`}
      className="relative col-start-1 row-start-1 mt-[6svh] sm:mt-[7.5svh] w-[min(100%,calc(80svh*16/9),1380px)] origin-[50%_25%] will-change-[transform,filter] max-sm:w-full [transform-style:preserve-3d]"
      style={{
        zIndex: i + 1,
        ...(still
          ? { y: stillY }
          : {
            y: scrollY,
            rotateX: activeMouse ? cardRotateX : scrollRotateX,
            rotateY: activeMouse ? cardRotateY : 0,
            scale,
            filter,
          }),
      }}
    >
      <div
        className="relative overflow-hidden rounded-[26px] ring-1 ring-white/20 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95)] transition-all duration-300"
        style={{ background: ground }}
      >
        {p.image ? (
          <img
            src={p.image}
            alt={`The ${host(p.url)} preview`}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
            className="block aspect-[16/9] w-full object-cover object-top max-sm:aspect-[4/5]"
          />
        ) : (
          <SlideFrame index={i} project={p.portfolio ?? portfolioProjects[i] ?? portfolioProjects[0]} />
        )}

        <Visit p={p} ground={ground} onOpenProject={onOpenProject} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#07070a]"
          style={{ opacity: still ? 0 : dim }}
        />
      </div>

      {/* 3D Anime Mascot perched on the top-right card border */}
      <SlideMascot index={i} />
    </motion.article>
  );
}

/** 3D Interactive Stage Component that tracks pointer movement and turns towards the cursor in true 3D space */
function Interactive3DStage({
  children,
  className = '',
  maxTilt = 18,
  accent = '#ff3d5a',
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  accent?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const active = fine && !reduced;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springConfig = { stiffness: 140, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(my, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-maxTilt, maxTilt]), springConfig);
  const spotX = useSpring(useTransform(mx, [0, 1], [0, 100]), springConfig);
  const spotY = useSpring(useTransform(my, [0, 1], [0, 100]), springConfig);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mx.set(Math.max(0, Math.min(1, x)));
    my.set(Math.max(0, Math.min(1, y)));
  };

  const onPointerLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const glareBg = useTransform(
    [spotX, spotY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${x}% ${y}%, ${accent}33, transparent 65%),
       radial-gradient(220px circle at ${x}% ${y}%, rgba(255,255,255,0.22), transparent 55%)`,
  );

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative [perspective:1400px] select-none ${className}`}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d] will-change-transform"
        style={active ? { rotateX, rotateY } : undefined}
      >
        {children}
        {active && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 rounded-3xl mix-blend-screen opacity-90 transition-opacity"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}

/** 3D Anime Mascot sitting/peeking over the top-right border of the cards */
function SlideMascot({ index }: { index: number }) {
  const reduced = useReducedMotionPref();

  if (index === 0) {
    // Slide 1: Character 1 - Sitting down, waving hand
    // In 1.png (1024x1024), the horizontal seat line is at y = 625px (61.0%).
    // Moving up by 61% (translateY(-61%)) anchors her seat line with sub-pixel precision directly on the card's top border.
    // Upgraded sizing (w-44 / sm:w-60 / lg:w-80) with soft rim backlight ensures full head & hair dome visibility.
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute z-30 select-none right-1 sm:right-3 lg:right-6 w-44 sm:w-60 lg:w-80 will-change-transform"
        style={{
          top: 0,
          transform: 'translateY(-61%) translateZ(65px)',
        }}
      >
        <motion.div
          animate={!reduced ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/assets/anime/1.png"
            alt="Benita Samson 3D Character Sitting and Waving"
            loading="eager"
            decoding="async"
            className="h-auto w-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.92)] drop-shadow-[0_0_14px_rgba(255,255,255,0.22)] filter brightness-[1.05]"
          />
        </motion.div>
      </div>
    );
  }

  if (index === 1) {
    // Slide 2: Character 2 - Peeking with hands placed on the top border
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute z-30 select-none right-2 sm:right-4 lg:right-8 w-48 sm:w-64 lg:w-84 will-change-transform"
        style={{
          top: 0,
          transform: 'translateY(-93%) translateZ(65px)',
        }}
      >
        <motion.div
          animate={!reduced ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/assets/anime/2.png"
            alt="Benita Samson 3D Character Peeking"
            loading="eager"
            decoding="async"
            className="h-auto w-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.92)] drop-shadow-[0_0_14px_rgba(255,255,255,0.22)] filter brightness-[1.05]"
          />
        </motion.div>
      </div>
    );
  }

  if (index === 2) {
    // Slide 3: Character 3 - Sitting with film clapperboard & thumbs up
    // In 3.png (1792x2400), the horizontal seat line is at y = 1657px (69.04%).
    // Moving up by 69% (translateY(-69%)) anchors her seat line with sub-pixel precision directly on Slide 3's top border.
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute z-30 select-none right-1 sm:right-3 lg:right-4 w-36 sm:w-48 lg:w-60 will-change-transform"
        style={{
          top: 0,
          transform: 'translateY(-69%) translateZ(65px)',
        }}
      >
        <motion.div
          animate={!reduced ? { y: [0, -4, 0] } : undefined}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/assets/anime/3.png"
            alt="Benita Samson 3D Character Media Ventures Clapperboard"
            loading="eager"
            decoding="async"
            className="h-auto w-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.92)] drop-shadow-[0_0_14px_rgba(56,189,248,0.25)] filter brightness-[1.05]"
          />
        </motion.div>
      </div>
    );
  }

  return null;
}

/** Rich slide frame dispatcher: routes to Slide 1, Slide 2, or Slide 3 */
function SlideFrame({ index, project }: { index: number; project: PortfolioProject }) {
  if (index === 0) {
    return <Slide1CareerHQ project={project} />;
  }
  if (index === 1) {
    return <Slide2CareerWithBeni project={project} />;
  }
  if (index === 2) {
    return <Slide3MediaVentures project={project} />;
  }
  return <PortfolioPreviewFrame project={project} index={index} />;
}

/** SLIDE 1: TWO JOURNEYS • ONE SHARED BRAND — The Birth of Career HQ (PDF Page 3 & 4) */
function Slide1CareerHQ({ project }: { project: PortfolioProject }) {
  return (
    <div className="relative aspect-[16/9] min-h-[580px] lg:min-h-[630px] max-h-[84svh] w-full overflow-hidden bg-ink-2 select-none max-sm:aspect-auto max-sm:min-h-[740px]">
      <ProjectArt project={project} />

      {/* Chrome header */}
      <div className="relative z-[1] flex items-center justify-between border-b border-white/10 bg-black/60 px-5 py-2.5 backdrop-blur-md sm:px-7 pr-28 sm:pr-40 lg:pr-56">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff3d5a] shadow-[0_0_10px_#ff3d5a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 hidden rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[11px] text-mist sm:inline-block">
            original-01 / the-birth-of-career-hq
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[#ff3d5a]/40 bg-[#ff3d5a]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em] text-[#ff3d5a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff3d5a] animate-pulse" />
            15 OCT 2025
          </span>
        </div>
      </div>

      {/* Main body */}
      <div className="relative z-[1] flex h-[calc(100%-44px)] flex-col justify-between overflow-y-auto p-5 sm:p-7 lg:p-9">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8 items-center">
          {/* Left Column: The Narrative & 6 Pillars */}
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#ff3d5a]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ff3d5a] shadow-[0_0_8px_#ff3d5a]" />
              TWO JOURNEYS • ONE SHARED BRAND
            </p>
            <h3 className="font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[0.88] tracking-wide text-bone drop-shadow-md">
              THE BIRTH OF CAREER HQ
            </h3>

            {/* Streamlined Hero Narrative */}
            <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-bone/90">
              Co-founded by <strong className="text-bone font-semibold">Benita &amp; Gandhi</strong> on <span className="text-[#ff3d5a] font-medium">15 October 2025</span>, uniting complementary strengths under one shared brand to connect students with educational opportunities, career pathways, and institutional partnerships across India and worldwide.
            </p>

            {/* 6 Pillars Compact Grid */}
            <div className="mt-3.5 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between pb-1.5 mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff3d5a]">
                  6 CORE AREAS OF WORK
                </p>
                <span className="text-[10px] text-mist/80 font-medium">Education &amp; Opportunities</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {CAREER_HQ_AREAS.map((area) => (
                  <div
                    key={area.title}
                    className="group/pill rounded-lg border border-white/10 bg-black/45 p-2 backdrop-blur-md transition-all duration-300 hover:border-[#ff3d5a]/60 hover:bg-[#ff3d5a]/10"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff3d5a] group-hover/pill:text-bone">
                      {area.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[9px] text-mist">{area.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* First-Year Expansion One-Line Badge */}
            <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#ff3d5a] shrink-0 animate-pulse" />
              <p className="text-[10.5px] leading-snug text-mist">
                <strong className="text-bone font-medium">First-Year Milestone:</strong> Rapid expansion across domestic &amp; global admissions, training &amp; placement, loan &amp; scholarship support with lasting institutional relationships.
              </p>
            </div>
          </div>

          {/* Right Column: 3D Interactive Global Shield & Compass (Tilts with cursor!) */}
          <div className="flex items-center justify-center">
            <Interactive3DStage maxTilt={22} accent="#ff3d5a" className="w-full max-w-[420px] min-h-[350px] flex items-center justify-center">
              {/* Layer 1: Ambient Halo & Rotating Orbital Rings (Z: 0px) */}
              <div style={{ transform: 'translateZ(0px)' }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-64 w-64 rounded-full bg-gradient-to-tr from-[#ff3d5a]/25 via-[#e5132b]/15 to-transparent blur-2xl" />
                <svg viewBox="0 0 320 320" className="absolute h-72 w-72 animate-[spin_60s_linear_infinite] opacity-40">
                  <circle cx="160" cy="160" r="140" fill="none" stroke="#ff3d5a" strokeWidth="1.2" strokeDasharray="6 8" />
                  <circle cx="160" cy="160" r="115" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 14" opacity="0.4" />
                </svg>
              </div>

              {/* Layer 2: 3D Glass Shield Sculpture (Z: 40px) */}
              <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }} className="relative z-10 flex flex-col items-center">
                <div className="relative flex h-56 w-48 items-center justify-center rounded-2xl border-2 border-[#ff3d5a]/60 bg-gradient-to-b from-[#2a0610]/95 via-[#1a040b]/95 to-[#0b0710]/98 shadow-[0_30px_70px_-15px_rgba(229,19,43,0.55),inset_0_1px_3px_rgba(255,255,255,0.4)] backdrop-blur-xl">
                  {/* Shield emblem geometry */}
                  <svg viewBox="0 0 120 160" className="h-36 w-32 text-[#ff3d5a] drop-shadow-[0_0_15px_rgba(255,61,90,0.6)]">
                    <defs>
                      <linearGradient id="shieldGrad1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ff5773" />
                        <stop offset="100%" stopColor="#a80b2a" />
                      </linearGradient>
                    </defs>
                    <path d="M60 10 L110 32 V85 C110 125 85 148 60 156 C35 148 10 125 10 85 V32 Z" fill="url(#shieldGrad1)" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M60 26 L96 42 V84 C96 116 78 134 60 142 C42 134 24 116 24 84 V42 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                    <path d="M42 80 L54 92 L78 64" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="absolute -bottom-3 rounded-full border border-[#ff3d5a]/70 bg-black/90 px-3.5 py-1 text-[10px] font-bold tracking-widest text-bone shadow-[0_0_15px_rgba(255,61,90,0.4)]">
                    CAREER HQ
                  </div>
                </div>
              </div>

              {/* Layer 3: Floating 3D Holographic Badges (Z: 75px) */}
              <motion.div
                style={{ transform: 'translateZ(75px)', transformStyle: 'preserve-3d' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 -left-4 z-20 rounded-xl border border-white/20 bg-black/90 px-3.5 py-2 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ff3d5a]">
                  <span className="h-2 w-2 rounded-full bg-[#ff3d5a] animate-pulse" />
                  15 Oct 2025 • Shared Brand
                </p>
                <p className="mt-0.5 text-[10px] text-bone/80">Benita Samson &amp; Gandhi</p>
              </motion.div>

              <motion.div
                style={{ transform: 'translateZ(85px)', transformStyle: 'preserve-3d' }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute -bottom-2 -right-4 z-20 rounded-xl border border-white/20 bg-black/90 px-3.5 py-2 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-bone">
                  6 Strategic Pillars
                </p>
                <p className="text-[10px] text-mist">India &amp; Global Admissions</p>
              </motion.div>
            </Interactive3DStage>
          </div>
        </div>

        {/* Bottom metrics row */}
        <div className="grid max-w-[calc(100%-180px)] sm:max-w-[calc(100%-270px)] grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
          <MetricBadge value="15 OCT" label="2025 Brand Launch" accent="#ff3d5a" />
          <MetricBadge value="6 PILLARS" label="Core Service Areas" accent="#ff3d5a" />
          <MetricBadge value="8 → 15" label="Team Growth Vision" accent="#ff3d5a" />
          <MetricBadge value="INDIA+" label="Global Education Reach" accent="#ff3d5a" />
        </div>
      </div>
    </div>
  );
}

/** SLIDE 2: INSTAGRAM • PERSONAL BRAND — Career with Beni (PDF Page 4) */
function Slide2CareerWithBeni({ project }: { project: PortfolioProject }) {
  return (
    <div className="relative aspect-[16/9] min-h-[580px] lg:min-h-[630px] max-h-[84svh] w-full overflow-hidden bg-ink-2 select-none max-sm:aspect-auto max-sm:min-h-[740px]">
      <ProjectArt project={project} />

      {/* Chrome header */}
      <div className="relative z-[1] flex items-center justify-between border-b border-white/10 bg-black/60 px-5 py-2.5 backdrop-blur-md sm:px-7 pr-28 sm:pr-40 lg:pr-56">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffb547] shadow-[0_0_10px_#ffb547]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 hidden rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[11px] text-mist sm:inline-block">
            original-02 / career-with-beni
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[#ffb547]/40 bg-[#ffb547]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em] text-[#ffb547]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffb547] animate-pulse" />
            12 FEB 2026
          </span>
        </div>
      </div>

      {/* Main body */}
      <div className="relative z-[1] flex h-[calc(100%-44px)] flex-col justify-between overflow-y-auto p-5 sm:p-7 lg:p-9">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8 items-center">
          {/* Left Column: Story & Narrative */}
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#ffb547]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#ffb547] shadow-[0_0_8px_#ffb547]" />
              INSTAGRAM • PERSONAL BRAND
            </p>
            <h3 className="font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[0.88] tracking-wide text-bone drop-shadow-md">
              CAREER WITH BENI
            </h3>

            {/* Streamlined Hero Narrative */}
            <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-bone/90">
              Launched on <span className="text-[#ffb547] font-semibold">12 February 2026</span>, <strong className="text-bone font-medium">Career with Beni</strong> is Benita&apos;s digital platform created to share knowledge, inspire individuals, and build meaningful mentorship connections with students and aspiring professionals worldwide.
            </p>

            {/* 2 Key Milestone Cards (Visual Stats) */}
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-black/45 p-2.5 backdrop-blur-md">
                <p className="font-display text-xl sm:text-2xl font-bold text-bone tracking-tight">50,000+</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffb547]">INSTAGRAM FOLLOWERS</p>
                <p className="mt-0.5 text-[9.5px] text-mist">Approx. 6-Month Milestone</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/45 p-2.5 backdrop-blur-md">
                <p className="font-display text-xl sm:text-2xl font-bold text-bone tracking-tight">120+</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffb547]">VIDEOS PUBLISHED</p>
                <p className="mt-0.5 text-[9.5px] text-mist">Consistent Reels &amp; Guidance</p>
              </div>
            </div>

            {/* Tags row */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                'Digital Mentorship',
                'Instagram Reels',
                'Career Guidance',
                'Global Admissions',
                'Meaningful Connections',
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[10.5px] font-medium text-bone/90 backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Core Mission Callout */}
            <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#ffb547] shrink-0 animate-pulse" />
              <p className="text-[10.5px] leading-snug text-mist">
                <strong className="text-bone font-medium">Community Impact:</strong> Built on genuine mentorship and consistent content, empowering thousands of students across India and internationally.
              </p>
            </div>
          </div>

          {/* Right Column: 3D Interactive Instagram Holographic Studio & Gold Trophy (Tilts with cursor!) */}
          <div className="flex items-center justify-center">
            <Interactive3DStage maxTilt={22} accent="#ffb547" className="w-full max-w-[420px] min-h-[350px] flex items-center justify-center">
              {/* Layer 1: Warm Golden Halo (Z: 0px) */}
              <div style={{ transform: 'translateZ(0px)' }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-64 w-64 rounded-full bg-gradient-to-tr from-[#ffb547]/25 via-[#d97706]/15 to-transparent blur-2xl" />
                <svg viewBox="0 0 320 320" className="absolute h-72 w-72 animate-[spin_50s_linear_infinite] opacity-35">
                  <circle cx="160" cy="160" r="140" fill="none" stroke="#ffb547" strokeWidth="1.2" strokeDasharray="4 10" />
                </svg>
              </div>

              {/* Layer 2: 3D Creator Smartphone Frame (Z: 35px) */}
              <div style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }} className="relative z-10 flex flex-col items-center">
                <div className="relative w-56 rounded-[28px] border-2 border-white/25 bg-gradient-to-b from-[#1c1208]/95 to-[#0b0805]/98 p-3.5 shadow-[0_30px_70px_-15px_rgba(217,119,6,0.5),inset_0_1px_3px_rgba(255,255,255,0.4)] backdrop-blur-xl">
                  {/* Top Phone speaker notch */}
                  <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/20" />
                  {/* Profile Bar */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/50 p-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] p-0.5 shadow-md">
                      <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-bone">
                        B
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[11px] font-bold text-bone flex items-center gap-1">
                        careerwithbeni
                        <span className="text-[#38bdf8] text-[10px]">✓</span>
                      </p>
                      <p className="text-[9px] text-mist truncate">Benita Samson</p>
                    </div>
                  </div>
                  {/* Screen Preview Graphic */}
                  <div className="mt-2.5 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-[#2a1705] to-[#120a02] border border-[#ffb547]/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,181,71,0.25),transparent_70%)]" />
                    <div className="relative text-center px-2">
                      <p className="text-xs font-bold text-bone">Knowledge · Mentorship</p>
                      <p className="text-[10px] text-[#ffb547] font-semibold mt-0.5">120+ Published Videos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 3: Floating 3D Gold Milestone Badge (Z: 85px) */}
              <motion.div
                style={{ transform: 'translateZ(85px)', transformStyle: 'preserve-3d' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-3 -left-4 z-20 rounded-2xl border-2 border-[#ffb547]/70 bg-gradient-to-b from-[#1a1205] to-[#0c0803] p-4 shadow-[0_25px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,181,71,0.25)] backdrop-blur-xl"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl leading-none text-bone tracking-tight">50,000+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffb547]">FOLLOWERS</span>
                </div>
                <p className="mt-1 text-[10px] font-medium text-mist">Approx. Six-Month Milestone</p>
              </motion.div>

              {/* Layer 4: Floating Reels Icon (Z: 95px) */}
              <motion.div
                style={{ transform: 'translateZ(95px)', transformStyle: 'preserve-3d' }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-3 -right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/90 px-3.5 py-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <span className="h-2 w-2 rounded-full bg-[#ffb547] animate-ping" />
                <span className="text-[10px] font-bold tracking-wider text-bone">120+ REELS</span>
              </motion.div>
            </Interactive3DStage>
          </div>
        </div>

        {/* Bottom metrics row */}
        <div className="grid max-w-[calc(100%-180px)] sm:max-w-[calc(100%-270px)] grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
          <MetricBadge value="50,000+" label="Instagram Followers" accent="#ffb547" />
          <MetricBadge value="120+" label="Videos Published" accent="#ffb547" />
          <MetricBadge value="12 FEB" label="2026 Launch Date" accent="#ffb547" />
          <MetricBadge value="~6 MO" label="To 50K Milestone" accent="#ffb547" />
        </div>
      </div>
    </div>
  );
}

/** SLIDE 3: UPCOMING • YOUTUBE — Media & Content Ventures (PDF Page 4) */
function Slide3MediaVentures({ project }: { project: PortfolioProject }) {
  return (
    <div className="relative aspect-[16/9] min-h-[580px] lg:min-h-[630px] max-h-[84svh] w-full overflow-hidden bg-ink-2 select-none max-sm:aspect-auto max-sm:min-h-[740px]">
      <ProjectArt project={project} />

      {/* Chrome header */}
      <div className="relative z-[1] flex items-center justify-between border-b border-white/10 bg-black/60 px-5 py-2.5 backdrop-blur-md sm:px-7 pr-28 sm:pr-40 lg:pr-56">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 hidden rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[11px] text-mist sm:inline-block">
            original-03 / media-and-content-ventures
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em] text-[#38bdf8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            UPCOMING • YOUTUBE
          </span>
        </div>
      </div>

      {/* Main body */}
      <div className="relative z-[1] flex h-[calc(100%-44px)] flex-col justify-between overflow-y-auto p-5 sm:p-7 lg:p-9">
        <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8 items-center">
          {/* Left Column: Vision & YouTube Architecture */}
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-[#38bdf8]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
              UPCOMING • YOUTUBE
            </p>
            <h3 className="font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[0.88] tracking-wide text-bone drop-shadow-md">
              MEDIA &amp; CONTENT VENTURES
            </h3>

            {/* Streamlined Hero Narrative */}
            <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-bone/90">
              Expanding beyond education, Benita&apos;s media vision creates knowledge-sharing platforms to bring authentic founder journeys, industry wisdom, and overlooked stories to a wider global audience.
            </p>

            {/* The 2 Shows Breakdown (Side-by-Side Dual Cards) */}
            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#38bdf8]/30 bg-black/45 p-2.5 backdrop-blur-md transition-all duration-300 hover:border-[#38bdf8]/60">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm sm:text-base font-bold text-bone tracking-wide">MIC &amp; MENTORS</p>
                  <span className="rounded bg-[#38bdf8]/20 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-[#38bdf8]">
                    CHANNEL
                  </span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-mist">
                  Flagship interview-led channel featuring founders, CEOs, and industry leaders sharing practical insights.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/45 p-2.5 backdrop-blur-md transition-all duration-300 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm sm:text-base font-bold text-bone tracking-wide">TRP – REALITY PROJECT</p>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-bone/80">
                    SHOW
                  </span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-mist">
                  Documentary show concept spotlighting real people, overlooked professions, and everyday narratives.
                </p>
              </div>
            </div>

            {/* Architecture Clarity Badge (Key PDF Requirement) */}
            <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-[#38bdf8]/30 bg-black/45 px-3 py-2 backdrop-blur-sm shadow-[0_0_15px_rgba(56,189,248,0.1)]">
              <span className="h-2 w-2 rounded-full bg-[#38bdf8] shrink-0 animate-pulse" />
              <p className="text-[10.5px] leading-snug text-mist">
                <strong className="text-bone font-medium">Channel Architecture:</strong> <span className="text-[#38bdf8]">Mic &amp; Mentors</span> is the upcoming YouTube channel. <span className="text-bone">TRP – The Reality Project</span> is a separate show within the channel (not a second channel).
              </p>
            </div>

            {/* Tags row */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                'YouTube Channel',
                'Mic & Mentors',
                'TRP Reality Show',
                'Founder Interviews',
                'Overlooked Professions',
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[10.5px] font-medium text-bone/90 backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Interactive Broadcast Stage & YouTube Studio (Tilts with cursor!) */}
          <div className="flex items-center justify-center">
            <Interactive3DStage maxTilt={22} accent="#38bdf8" className="w-full max-w-[420px] min-h-[350px] flex items-center justify-center">
              {/* Layer 1: Electric Blue Spotlight & Studio Grid (Z: 0px) */}
              <div style={{ transform: 'translateZ(0px)' }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-64 w-64 rounded-full bg-gradient-to-tr from-[#38bdf8]/25 via-[#0284c7]/15 to-transparent blur-2xl" />
                <svg viewBox="0 0 320 320" className="absolute h-72 w-72 animate-[spin_55s_linear_infinite] opacity-35">
                  <circle cx="160" cy="160" r="140" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="8 8" />
                </svg>
              </div>

              {/* Layer 2: 3D Dual Cinema Clapper / Studio Display (Z: 40px) */}
              <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }} className="relative z-10 flex flex-col items-center gap-3">
                {/* Clapper header */}
                <div className="flex w-64 items-center justify-between rounded-xl border border-white/20 bg-black/85 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                    <span className="font-mono text-[10px] font-bold tracking-widest text-[#38bdf8]">REC • 4K</span>
                  </div>
                  <span className="font-mono text-[10px] text-mist">STUDIO PRODUCTION</span>
                </div>

                {/* Production screen */}
                <div className="relative w-64 rounded-2xl border-2 border-[#38bdf8]/40 bg-gradient-to-b from-[#081a28]/95 to-[#040c14]/98 p-4 shadow-[0_30px_70px_-15px_rgba(2,132,199,0.5)] backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                    <p className="font-display text-lg text-bone tracking-wide">MIC &amp; MENTORS</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#38bdf8]">YOUTUBE</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-mist">Interviews with Founders, CEOs &amp; Industry Leaders</p>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <p className="font-display text-base text-bone tracking-wide">TRP – THE REALITY PROJECT</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-bone/70">SHOW</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-mist">Documentaries on Real People &amp; Overlooked Professions</p>
                </div>
              </div>

              {/* Layer 3: Floating 3D Broadcast Badge (Z: 80px) */}
              <motion.div
                style={{ transform: 'translateZ(80px)', transformStyle: 'preserve-3d' }}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-3 -right-3 z-20 rounded-xl border border-[#38bdf8]/50 bg-black/90 px-3.5 py-2 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8]">
                  Channel Architecture
                </p>
                <p className="text-[10px] text-bone font-medium">TRP is a show inside Mic &amp; Mentors</p>
              </motion.div>

              {/* Layer 4: Floating YouTube Play Emblem (Z: 90px) */}
              <motion.div
                style={{ transform: 'translateZ(90px)', transformStyle: 'preserve-3d' }}
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute -top-3 -left-3 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-black/90 px-3.5 py-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-red-500">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                <span className="text-[10px] font-bold tracking-wider text-bone">UPCOMING CHANNEL</span>
              </motion.div>
            </Interactive3DStage>
          </div>
        </div>

        {/* Bottom metrics row */}
        <div className="grid max-w-[calc(100%-180px)] sm:max-w-[calc(100%-270px)] grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
          <MetricBadge value="YOUTUBE" label="Flagship Platform" accent="#38bdf8" />
          <MetricBadge value="LEADERS" label="Founders & CEOs" accent="#38bdf8" />
          <MetricBadge value="TRP SHOW" label="Documentary Concept" accent="#38bdf8" />
          <MetricBadge value="STORIES" label="Everyday Professions" accent="#38bdf8" />
        </div>
      </div>
    </div>
  );
}

function MetricBadge({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md shadow-sm">
      <div className="font-display text-xl sm:text-2xl leading-none tracking-wide" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-1 line-clamp-1 text-[10px] text-mist">{label}</div>
    </div>
  );
}

/** Fallback preview frame for any additional projects */
function PortfolioPreviewFrame({ project, index }: { project: PortfolioProject; index: number }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-2 select-none max-sm:aspect-[4/5]">
      <ProjectArt project={project} />

      {/* Subtle browser chrome bar */}
      <div className="relative z-[1] flex items-center justify-between border-b border-white/10 bg-black/45 px-5 py-3 backdrop-blur-md sm:px-7">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 hidden rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[11px] text-mist sm:inline-block">
            original-0{index + 1} / {project.id}
          </span>
        </div>
        <span className="rounded border border-white/20 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-bone/90">
          {project.year}
        </span>
      </div>

      {/* Main widescreen showcase body */}
      <div className="relative z-[1] flex h-[calc(100%-46px)] flex-col justify-between p-6 sm:p-10 lg:p-12">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-bone/75">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: project.palette.accent }}
            />
            {project.genre}
          </p>
          <h3 className="font-display text-[clamp(2.2rem,5.2vw,4.8rem)] leading-[0.88] tracking-wide text-bone drop-shadow-md">
            {project.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/85 sm:text-base lg:text-lg">
            {project.logline}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-bone/90 backdrop-blur"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom metrics row kept clear of the right-hand cut-out notch */}
        <div className="grid max-w-[calc(100%-170px)] grid-cols-2 gap-3 pt-4 sm:max-w-[calc(100%-260px)] sm:grid-cols-3 lg:grid-cols-4">
          {project.metrics.slice(0, 4).map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/10 bg-black/45 px-3.5 py-2.5 backdrop-blur-md"
            >
              <div
                className="font-display text-2xl leading-none tracking-wide sm:text-3xl"
                style={{ color: project.palette.accent }}
              >
                {m.value}
              </div>
              <div className="mt-1 line-clamp-1 text-[11px] text-mist">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The visit button, set into a corner cut out of the card. */
function Visit({
  p,
  ground,
  onOpenProject,
}: {
  p: Project;
  ground: string;
  onOpenProject?: (project: PortfolioProject) => void;
}) {
  const R = 18;
  const corner = (
    <svg aria-hidden width={R} height={R} viewBox={`0 0 ${R} ${R}`} className="block">
      <path d={`M${R} 0 V${R} H0 A${R} ${R} 0 0 0 ${R} 0 Z`} fill={ground} />
    </svg>
  );

  const isExternal = /^https?:\/\//i.test(p.url);
  const content = (
    <>
      <span className="flex flex-col leading-tight text-left">
        <span className="text-[14px] sm:text-[16px] font-semibold tracking-[-0.015em] text-bone">
          {p.name}
        </span>
        <span className="text-[11px] sm:text-[13px] text-mist underline-offset-4 group-hover:underline group-focus-visible:underline">
          {p.display ?? host(p.url)}
        </span>
      </span>
      <span
        className="grid size-9 sm:size-11 shrink-0 place-items-center rounded-full text-white transition-transform duration-200 ease-out group-hover:rotate-45 group-active:scale-90 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 shadow-md"
        style={{ background: p.accent, outlineColor: p.accent }}
      >
        <ArrowUpRightIcon className="size-4 sm:size-5" />
      </span>
    </>
  );

  const sharedClass =
    'group flex items-center gap-3 rounded-tl-[20px] py-2 pr-1 pl-3.5 outline-none sm:gap-4 sm:py-3 sm:pl-5';

  return (
    <div className="absolute right-0 bottom-0 z-10">
      <div className="pointer-events-none absolute right-0 bottom-full">{corner}</div>
      <div className="pointer-events-none absolute right-full bottom-0">{corner}</div>

      {p.portfolio && onOpenProject ? (
        <button
          type="button"
          onClick={() => onOpenProject(p.portfolio!)}
          data-cursor="view"
          aria-label={`Inspect ${p.name} details`}
          className={sharedClass}
          style={{ background: ground }}
        >
          {content}
        </button>
      ) : (
        <a
          href={p.url}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          data-cursor="link"
          aria-label={`Visit ${p.name} at ${host(p.url)}`}
          className={sharedClass}
          style={{ background: ground }}
        >
          {content}
        </a>
      )}
    </div>
  );
}
