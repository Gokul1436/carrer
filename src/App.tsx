import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { viewerProfiles, type ProfileId, type Project, type SectionId, type VideoReel } from './data/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import CustomCursor from './components/CustomCursor';
import CinematicLoader from './components/CinematicLoader';
import OpeningSequence from './components/OpeningSequence';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ContinueWatching from './components/ContinueWatching';
import PerspectiveTunnelHero from '@/components/ui/perspective-tunnel-hero';
import { ProjectDeck } from '@/components/ui/scroll-stacking-cards';
import Scene from './components/Scene';
import About from './components/About';
// import Seasons from './components/Seasons';
import Originals from './components/Originals';
import TopPicks from './components/TopPicks';
// import Skills from './components/Skills';
import Achievements from './components/Achievements';
import ResumeSection from './components/ResumeViewer';
import InstagramCard from './components/InstagramCard';
import FinalCTA from './components/FinalCTA';
import { EASE } from './components/fx';
import { refreshScrollTriggersSoon } from './lib/gsap';

// Overlays are only needed on demand — split them out of the first load.
const PlayIntro = lazy(() => import('./components/PlayIntro'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));
const VideoModal = lazy(() => import('./components/VideoModal'));

type Stage = 'loading' | 'opening' | 'home';

const STORAGE_KEY = 'sushmita-series-profile';

function readStoredProfile(): ProfileId | null {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return viewerProfiles.some((p) => p.id === v) ? (v as ProfileId) : null;
  } catch {
    return null;
  }
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Series />
    </SmoothScrollProvider>
  );
}

function Series() {
  const stored = readStoredProfile();
  const [stage, setStage] = useState<Stage>('loading');
  const [profileId, setProfileId] = useState<ProfileId>(stored ?? 'sushmita');
  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeReel, setActiveReel] = useState<VideoReel | null>(null);
  const [reelProgress, setReelProgress] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const { scrollTo, lock, unlock } = useSmoothScroll();

  const order = viewerProfiles.find((p) => p.id === profileId)!.order;

  useEffect(() => {
    if (stage !== 'home') return;
    refreshScrollTriggersSoon();
  }, [stage, profileId]);

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  const pickProfile = useCallback(
    (id: ProfileId) => {
      setProfileId(id);
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* storage unavailable — profile simply won't persist */
      }
      if (stage !== 'home') {
        window.scrollTo(0, 0);
        setStage('home');
      } else {
        const p = viewerProfiles.find((v) => v.id === id)!;
        setToast(`Now watching as ${p.name} — ${p.blurb.toLowerCase()}`);
        scrollTo(0, { offset: 0 });
      }
    },
    [stage, scrollTo],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const closeIntro = useCallback(() => setPlaying(false), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const openReel = useCallback((r: VideoReel) => {
    setActiveReel(r);
    setReelProgress((prev) => ({ ...prev, [r.id]: Math.max(prev[r.id] ?? 0, 0.15) }));
  }, []);
  const updateReelProgress = useCallback((id: string, pct: number) => {
    setReelProgress((prev) => {
      if ((prev[id] ?? 0) >= pct) return prev;
      return { ...prev, [id]: pct };
    });
  }, []);
  const closeReel = useCallback(() => setActiveReel(null), []);

  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    journey: null, // <Seasons /> (My Journey) commented out
    originals: <Originals onOpen={setProject} />,
    picks: <TopPicks />,
    skills: null, // <Skills /> (Genres · My Skill Universe) commented out
    moments: <Achievements />,
    story: <ResumeSection onView={() => setResumeOpen(true)} />,
  };

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />
      <CustomCursor />

      <AnimatePresence>
        {stage === 'loading' && (
          <CinematicLoader
            key="loader"
            onReady={() => {
              window.scrollTo(0, 0);
              setStage('opening');
            }}
          />
        )}
        {stage === 'opening' && (
          <OpeningSequence
            key="opening"
            onDone={() => {
              window.scrollTo(0, 0);
              setStage('home');
            }}
          />
        )}
      </AnimatePresence>

      {stage === 'home' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none', transform: 'none' } }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Navbar order={order} profileId={profileId} onSwitch={pickProfile} />
          <main>
            <Hero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onResume={() => setResumeOpen(true)} profileId={profileId} />
            <ContinueWatching onSelect={openReel} progressMap={reelProgress} paused={Boolean(activeReel)} />
            <PerspectiveTunnelHero onSelect={openReel} />
            <ProjectDeck onOpenProject={setProject} />
            {order.map((id) => (
              <Scene key={id} id={id} className={id === 'originals' ? '!py-0 sm:!py-0' : ''}>
                {sections[id]}
              </Scene>
            ))}
            <InstagramCard />
            <FinalCTA onReplay={() => setStage('loading')} />
          </main>
        </motion.div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence>{playing && <PlayIntro key="intro" onClose={closeIntro} />}</AnimatePresence>
        <AnimatePresence>{project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={setProject} />}</AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
        <AnimatePresence>{activeReel && <VideoModal key="video" reel={activeReel} onClose={closeReel} onSwitch={openReel} onProgress={updateReelProgress} />}</AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm text-bone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
