'use client';

import { useRef, type ReactNode } from 'react';
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { projects as portfolioProjects, type Project as PortfolioProject } from '@/data/portfolio';
import { ProjectArt } from '@/components/Poster';
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

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: portfolioProjects[0].id,
    name: portfolioProjects[0].title,
    summary: portfolioProjects[0].logline,
    url: portfolioProjects[0].externalUrl ?? '#originals',
    display: 'www.careerhq.in',
    accent: '#e5132b',
    portfolio: portfolioProjects[0],
  },
  {
    id: portfolioProjects[1].id,
    name: portfolioProjects[1].title,
    summary: portfolioProjects[1].logline,
    url: portfolioProjects[1].externalUrl ?? '#originals',
    display: 'instagram.com/careerwithbeni',
    accent: '#d97706',
    portfolio: portfolioProjects[1],
  },
  {
    id: portfolioProjects[2].id,
    name: portfolioProjects[2].title,
    summary: portfolioProjects[2].logline,
    url: portfolioProjects[2].externalUrl ?? '#originals',
    display: 'benitasamson.com',
    accent: '#0284c7',
    portfolio: portfolioProjects[2],
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
        aria-label="Featured Project Deck"
      >
        {/* Subtle ambient crimson stage glow matching site theme */}
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 z-0 h-0 w-full overflow-visible"
        >
          <div className="h-[60vh] w-full bg-[radial-gradient(60%_50%_at_50%_15%,rgba(229,19,43,0.10),transparent_70%)]" />
        </div>

        <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden px-5 [perspective:1800px] sm:px-10 lg:px-14">
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
          <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center sm:top-24">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-mist/80 sm:text-[11px]">
              <span className="h-px w-6 bg-crimson" />
              Featured Productions · Scroll Deck
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
  // Cards currently lying on top of this one, counted smoothly
  const above = (v: number) => {
    let n = 0;
    for (let j = i + 1; j < count; j++) n += arrived(j, v, count);
    return Math.min(3, n);
  };

  const y = useTransform(progress, (v) => `${(1 - arrived(i, v, count)) * 108 - above(v) * 5}svh`);
  const rotateX = useTransform(progress, (v) => -(1 - arrived(i, v, count)) * 30 + above(v) * 5);
  const scale = useTransform(progress, (v) => 0.9 + 0.1 * arrived(i, v, count) - above(v) * 0.05);
  const filter = useTransform(
    progress,
    (v) => `blur(${((1 - arrived(i, v, count)) ** 2 * 12 + above(v) * 1.1).toFixed(2)}px)`,
  );
  const dim = useTransform(progress, (v) => above(v) * 0.22);
  const stillY = useTransform(progress, (v) => (arrived(i, v, count) >= 0.5 ? '0svh' : '110svh'));

  return (
    <motion.article
      aria-label={`${p.name}: ${p.summary}`}
      className="col-start-1 row-start-1 mt-[6svh] w-[min(100%,calc(78svh*16/9),1320px)] origin-[50%_25%] will-change-[transform,filter] max-sm:w-full"
      style={{ zIndex: i + 1, ...(still ? { y: stillY } : { y, rotateX, scale, filter }) }}
    >
      <div
        className="relative overflow-hidden rounded-[24px] ring-1 ring-white/15 shadow-[0_50px_90px_-35px_rgba(0,0,0,0.9)]"
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
        ) : p.portfolio ? (
          <PortfolioPreviewFrame project={p.portfolio} index={i} />
        ) : (
          <div className="aspect-[16/9] w-full bg-ink-2 max-sm:aspect-[4/5]" />
        )}

        <Visit p={p} ground={ground} onOpenProject={onOpenProject} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#07070a]"
          style={{ opacity: still ? 0 : dim }}
        />
      </div>
    </motion.article>
  );
}

/** Rich live-site style showcase frame built directly from a portfolio project's architecture & metrics. */
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
        <span className="text-[15px] font-semibold tracking-[-0.015em] text-bone sm:text-[18px]">
          {p.name}
        </span>
        <span className="text-[12px] text-mist underline-offset-4 group-hover:underline group-focus-visible:underline sm:text-[14px]">
          {p.display ?? host(p.url)}
        </span>
      </span>
      <span
        className="grid size-10 shrink-0 place-items-center rounded-full text-white transition-transform duration-200 ease-out group-hover:rotate-45 group-active:scale-90 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 sm:size-12"
        style={{ background: p.accent, outlineColor: p.accent }}
      >
        <ArrowUpRightIcon className="size-5 sm:size-6" />
      </span>
    </>
  );

  const sharedClass =
    'group flex items-center gap-3.5 rounded-tl-[20px] py-2.5 pr-1 pl-4 outline-none sm:gap-5 sm:py-3.5 sm:pl-6';

  return (
    <div className="absolute right-0 bottom-0 z-10">
      <div className="pointer-events-none absolute right-0 bottom-full">{corner}</div>
      <div className="pointer-events-none absolute right-full bottom-0">{corner}</div>

      {p.portfolio && onOpenProject ? (
        <button
          type="button"
          onClick={() => onOpenProject(p.portfolio!)}
          data-cursor="view"
          aria-label={`Inspect ${p.name} case study`}
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

