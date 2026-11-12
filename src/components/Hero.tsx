import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { profile, type ProfileId } from '../data/portfolio';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import ParallaxLayer from './ui/ParallaxLayer';
import SoftAurora from './ui/SoftAurora';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

export default function Hero({ onPlay, onResume, profileId }: { onPlay: () => void; onResume: () => void; profileId: ProfileId }) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const { scrollTo } = useSmoothScroll();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blackout = useTransform(scrollYProgress, [0.35, 1], [0, 1]);

  // pointer parallax (desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });
  const chipX = useTransform(px, [-1, 1], [18, -18]);
  const chipY = useTransform(py, [-1, 1], [12, -12]);
  const glowX = useTransform(px, [-1, 1], ['-6%', '6%']);

  const meta = [
    'Connecting Dots Worldwide',
    'Career HQ',
    '50,000+ Followers',
    'Team of 8 → 15',
  ];

  const floating = [
    { text: '50,000+ Followers', sub: 'Career with Beni · 120+ Videos', pos: 'left-[-5%] bottom-[16%]', depth: 1 },
    { text: 'Career HQ', sub: 'Co-Founder & CEO · Oct 2025', pos: 'right-[1%] top-[16%]', depth: -1 },
    { text: 'Connecting Dots', sub: 'Registered in Australia · 2025', pos: 'right-[1%] bottom-[12%]', depth: 0.6 },
  ];

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden"
      onPointerMove={(e) => {
        if (!fine) return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      {/* left-side crimson red atmosphere + clean right-stage banner-video-2 */}
      <ParallaxLayer yPercent={[0, -14]} start="top top" end="bottom top" scrub={0.8} className="pointer-events-none absolute inset-0 bg-[#140308]">
        {/* Left-side rich red backdrop & interactive SoftAurora */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(75%_90%_at_18%_52%,rgba(229,19,43,0.62),rgba(135,10,28,0.42)_42%,rgba(10,4,7,0.96)_78%)]"
        />
        <div className="pointer-events-none absolute inset-0">
          <SoftAurora
            speed={0.55}
            scale={1.45}
            brightness={1.05}
            color1="#ff3d5a"
            color2="#a80b2a"
            bandHeight={0.58}
            bandSpread={1.15}
            spectrum={0.45}
            tilt={-8}
            opacity={0.52}
            enableMouseInteraction={fine}
            mouseInfluence={0.22}
          />
        </div>

        {/* Right-aligned banner-video-2 kept natural with soft edge blending only */}
        <motion.div
          className="absolute inset-0 lg:left-auto lg:right-[-2vw] lg:w-[66vw] xl:w-[62vw] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_24%,black_92%,transparent_100%)]"
          style={{ y: imgY, scale: imgScale, opacity: fade }}
        >
          <video
            src={profile.bannerVideo}
            autoPlay={!reduced}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            className="h-full w-full object-cover object-[50%_16%]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />
        </motion.div>

        <motion.div aria-hidden className="absolute inset-0" style={{ x: glowX }}>
          <div className="absolute left-[-10%] top-[6%] h-[84vh] w-[58vw] rounded-full bg-[radial-gradient(closest-side,rgba(229,19,43,0.48),rgba(165,12,38,0.18)_58%,transparent)] blur-3xl" />
          <div className="absolute bottom-[-18%] left-[10%] h-[65vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(190,14,42,0.34),transparent)] blur-3xl" />
        </motion.div>
      </ParallaxLayer>
      <Particles className="z-[1]" />
      <div aria-hidden className="absolute inset-0 z-[1] overflow-hidden">
        <span className="light-streak left-[40%] top-[22%] w-[50vw]" style={{ animationDelay: '1.2s' }} />
        <span className="light-streak left-[30%] top-[64%] w-[40vw]" style={{ animationDelay: '3.6s' }} />
        <span className="light-streak left-[55%] top-[44%] w-[30vw]" style={{ animationDelay: '5.2s' }} />
      </div>

      {/* floating UI chips framed around the right banner subject */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-12 z-[4] hidden h-[70svh] md:block lg:bottom-0 lg:left-auto lg:right-[2vw] lg:top-20 lg:h-auto lg:w-[54vw] xl:right-[3vw] xl:w-[50vw]"
        style={{ y: imgY, opacity: fade }}
      >
        <div className="relative h-full w-full lg:h-[86vh]">
          {floating.map((f, i) => (
            <FloatChip key={f.text} {...f} index={i} mx={chipX} my={chipY} />
          ))}
        </div>
      </motion.div>

      {/* readability gradients (top navbar + subtle left crimson scrim + bottom) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-32 bg-gradient-to-b from-ink/90 via-ink/45 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[40svh] z-[3] h-[36svh] bg-gradient-to-b from-transparent via-ink/75 to-ink lg:hidden" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] hidden bg-[linear-gradient(90deg,rgba(28,4,10,0.42)_0%,rgba(16,3,7,0.3)_38%,rgba(7,7,10,0.2)_52%,transparent_66%)] lg:block" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-ink to-transparent" />

      {/* copy */}
      <motion.div
        className="gutter relative z-[4] flex min-h-[100svh] flex-col justify-end pb-16 pt-[42svh] sm:pb-20 sm:pt-[46svh] lg:max-w-[48vw] lg:justify-center lg:pb-0 lg:pt-24"
        style={{ y: textY, opacity: fade }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-3">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.34em] text-crimson-2">
            Founder Profile <span className="text-mist/70">·</span> Connecting Dots
          </span>
        </motion.div>
        <motion.h1 variants={item} className="font-display leading-[0.82] tracking-[0.02em] text-bone" style={{ fontSize: 'clamp(4rem, 12vw, 11rem)' }}>
          <span className="shimmer-text">{profile.firstName}</span>
        </motion.h1>
        <motion.p variants={item} className="mt-1 font-sans text-sm font-bold tracking-[0.62em] text-crimson-2 sm:text-base">
          {profile.seriesTag}
        </motion.p>

        <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-medium text-mist">
          <span className="rounded border border-crimson-2/45 bg-crimson/15 px-1.5 py-px text-[10px] font-bold tracking-wider text-crimson-2">VISION</span>
          {meta.map((m, i) => (
            <span key={m} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-smoke" />}
              {m}
            </span>
          ))}
        </motion.div>

        <motion.p variants={item} className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-bone/90 sm:text-xs sm:tracking-[0.34em]">
          {profile.tagline.join(' • ')}
        </motion.p>

        <motion.p variants={item} className="mt-4 max-w-xl text-[15px] leading-relaxed text-bone/80 sm:text-base">
          {profile.intro}
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <button
              type="button"
              data-cursor="play"
              onClick={onPlay}
              className="flex min-h-12 items-center gap-3 rounded-md bg-bone px-6 py-3 text-[15px] font-bold text-ink shadow-[0_0_36px_rgba(229,19,43,0.35)] transition hover:bg-white sm:px-8"
            >
              <span className="text-lg text-crimson">▶</span> Play Intro
            </button>
          </Magnetic>
          <Magnetic>
            {profileId === 'recruiter' ? (
              <button type="button" onClick={onResume} className="glass flex min-h-12 items-center gap-3 rounded-md px-6 py-3 text-[15px] font-semibold text-bone transition hover:bg-white/15 sm:px-8">
                <span className="text-lg">⤓</span> View Profile PDF
              </button>
            ) : (
              <button
                type="button"
                onClick={() => scrollTo('#originals')}
                className="glass flex min-h-12 items-center gap-3 rounded-md px-6 py-3 text-[15px] font-semibold text-bone transition hover:bg-white/15 sm:px-8"
              >
                <span className="text-xl leading-none">＋</span> Ventures
              </button>
            )}
          </Magnetic>
          <button
            type="button"
            onClick={() => scrollTo('#about')}
            aria-label="More info"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-lg text-bone transition hover:border-bone hover:bg-white/10"
          >
            ⓘ
          </button>
        </motion.div>
      </motion.div>

      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-ink" style={{ opacity: blackout }} />
    </section>
  );
}

type MV = ReturnType<typeof useTransform<number, number>>;

function FloatChip({ text, sub, pos, depth, index, mx, my }: { text: string; sub: string; pos: string; depth: number; index: number; mx: MV; my: MV }) {
  const x = useTransform(mx, (n: number) => n * depth);
  const y = useTransform(my, (n: number) => n * depth);
  return (
    <motion.div
      className={`absolute hidden rounded-xl border border-crimson-2/25 bg-[#12060a]/85 px-4 py-2.5 shadow-[0_14px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(229,19,43,0.14)] backdrop-blur-md md:block ${pos}`}
      style={{ x, y }}
      initial={{ opacity: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, delay: 1.2 + index * 0.18, ease: EASE }}
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}>
        <p className="text-sm font-semibold text-bone">{text}</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-mist">{sub}</p>
      </motion.div>
    </motion.div>
  );
}
