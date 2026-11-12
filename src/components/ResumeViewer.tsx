import { useState } from 'react';
import { motion } from 'framer-motion';
import { achievements, archiveChapters, certifications, education, experience, profile, projects, skillCategories } from '../data/portfolio';
import { EASE, Magnetic, SectionHeading } from './fx';
import GsapSplitText from './ui/GsapSplitText';
import ParallaxLayer from './ui/ParallaxLayer';

/** THE FULL STORY — a designed founder dossier plus view / download actions. */
export default function ResumeSection({ onView }: { onView: () => void }) {
  return (
    <>
      <SectionHeading kicker="Founder Dossier" title="The Full Story" />
      <div className="gutter grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <ParallaxLayer yPercent={[3, -3]} desktopOnly>
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.1, ease: EASE }}
            style={{ transformPerspective: 1600 }}
          >
            <CollapsibleSheet />
          </motion.div>
        </ParallaxLayer>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <GsapSplitText
            as="p"
            text="From vision to impact, on one page."
            mode="reveal"
            stagger={0.05}
            className="font-serif text-3xl italic leading-tight text-bone"
          />
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Banking years, Madurai launch, Career HQ, Career with Beni, Connecting Dots Worldwide, and the birthday tribute — view it here or download the full PDF.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Magnetic className="w-full">
              <button
                type="button"
                data-cursor="view"
                onClick={onView}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
              >
                ▶ View Founder PDF
              </button>
            </Magnetic>
            <Magnetic className="w-full">
              <a
                href={profile.resumePdf}
                download="Benita_Samson_Founder_Portfolio.pdf"
                data-cursor="link"
                className="glass flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
              >
                ⤓ Download Founder PDF
              </a>
            </Magnetic>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 text-center">
            {[
              { v: '50K+', k: 'Followers' },
              { v: '120+', k: 'Videos' },
              { v: '8→15', k: 'Team' },
            ].map((s) => (
              <div key={s.k} className="bg-ink-2 px-2 py-4">
                <dd className="font-display text-3xl leading-none text-bone">{s.v}</dd>
                <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">{s.k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}

/** On phones the sheet starts as a teaser so the page keeps its pace; desktop shows it in full. */
function CollapsibleSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className={`overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-cine)] md:max-h-none ${open ? 'max-h-[4000px]' : 'max-h-[560px]'}`}>
        <ResumeSheet />
      </div>
      {!open && (
        <div className="absolute inset-x-0 bottom-0 flex h-48 items-end justify-center rounded-b-2xl bg-gradient-to-t from-ink via-ink/85 to-transparent pb-4 md:hidden">
          <button type="button" onClick={() => setOpen(true)} className="glass min-h-11 rounded-full px-5 text-sm font-semibold text-bone">
            Read the full story ↓
          </button>
        </div>
      )}
    </div>
  );
}

function H({ children }: { children: string }) {
  return <h4 className="mb-3 mt-7 border-b border-white/10 pb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2 first:mt-0">{children}</h4>;
}

export function ResumeSheet() {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#121218,#0c0c11)] p-6 ring-1 ring-white/10 sm:p-10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-2/70 to-transparent" />
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.34em] text-smoke">FOUNDER &amp; CEO · CONNECTING DOTS WORLDWIDE</p>
          <h3 className="mt-1 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[0.9] tracking-wide text-bone">{profile.fullName}</h3>
        </div>
        <div className="text-xs leading-relaxed text-mist sm:text-right">
          <a href={`mailto:${profile.email}`} className="block hover:text-bone">
            {profile.email} · {profile.phone}
          </a>
          <a href={profile.links.portfolio} target="_blank" rel="noreferrer" className="hover:text-bone">
            benitasamson.com ↗
          </a>
          {' · '}
          <a href={profile.links.careerhq} target="_blank" rel="noreferrer" className="hover:text-bone">
            www.careerhq.in ↗
          </a>
        </div>
      </header>

      <div className="grid gap-x-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <H>Banking Career · Australia</H>
          {education.map((e) => (
            <div key={e.school} className="mb-4">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {e.school}, {e.place}
                </p>
                <p className="text-xs text-smoke">{e.period}</p>
              </div>
              <p className="text-xs text-mist">
                {e.degree} · <span className="text-bone/80">{e.score}</span>
              </p>
            </div>
          ))}

          <H>Entrepreneurial Journey</H>
          {experience.map((x) => (
            <div key={x.company} className="mb-5">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {x.company} — {x.role}
                </p>
                <p className="text-xs text-smoke">{x.period}</p>
              </div>
              <ul className="mt-2 space-y-1.5">
                {x.points.map((p) => (
                  <li key={p} className="flex gap-2 text-xs leading-relaxed text-mist">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson-2" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <H>Flagship Ventures</H>
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">{p.title}</p>
                <p className="text-xs text-smoke">{p.year}</p>
              </div>
              <p className="text-xs text-mist">{p.stack.join(' · ')}</p>
            </div>
          ))}
        </div>

        <div>
          <H>Areas &amp; Initiatives</H>
          <div className="space-y-2">
            {skillCategories.map((c) => (
              <p key={c.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">{c.title}: </span>
                {c.skills.map((s) => s.name).join(', ')}
              </p>
            ))}
          </div>

          <H>Key Milestones</H>
          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">
                  {a.title} — {a.org}.
                </span>{' '}
                {a.detail}
              </li>
            ))}
          </ul>

          <H>The Journey in Frames</H>
          <ul className="space-y-1.5">
            {archiveChapters.map((ch) => (
              <li key={ch.title} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">{ch.title}:</span> {ch.detail}
              </li>
            ))}
          </ul>

          <H>Ecosystem Directory</H>
          <p className="text-xs leading-relaxed text-mist">
            {certifications.map((c) => c.name).join(' · ')}
          </p>
        </div>
      </div>
    </article>
  );
}
