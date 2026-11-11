import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { sectionMeta, type ProfileId, type SectionId } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE } from './fx';

type NavbarProps = {
  order: SectionId[];
  profileId?: ProfileId;
  onSwitch?: (id: ProfileId) => void;
};

export default function Navbar({ order }: NavbarProps) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState<string>('top');
  const [navItems, setNavItems] = useState<{ id: string; label: string }[]>([{ id: 'top', label: 'Home' }]);
  const { scrollTo } = useSmoothScroll();
  const headerRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24);
  });

  // Only list section links that actually exist on the page right now
  useEffect(() => {
    const extras: { id: string; label: string }[] = [
      { id: 'reels', label: 'Reels' },
      { id: 'showcase', label: 'Archive' },
      { id: 'deck', label: 'Deck' },
      { id: 'instagram', label: 'Instagram' },
    ].filter((item) => Boolean(document.getElementById(item.id)));

    const present = order
      .filter((id) => Boolean(document.getElementById(id)))
      .map((id) => ({ id, label: sectionMeta[id].nav }));

    const items = [{ id: 'top', label: 'Home' }, ...extras, ...present];
    setNavItems(items);

    const ids = [...items.map((i) => i.id), 'contact'];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [order]);

  useEffect(() => {
    if (!mobileNav) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNav(false);
    };
    const onOutside = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMobileNav(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onOutside);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onOutside);
    };
  }, [mobileNav]);

  const go = (id: string) => {
    setMobileNav(false);
    scrollTo(`#${id}`, { offset: id === 'top' ? 0 : -64 });
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-300 ${
        scrolled || mobileNav
          ? 'border-b border-white/[0.08] bg-ink/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-black/80 via-black/35 to-transparent'
      }`}
    >
      <div className="gutter flex h-16 items-center justify-between gap-6 md:h-[72px]">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => go('top')}
          aria-label="Career HQ — Back to top"
          className="group flex shrink-0 items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/70 rounded-sm"
        >
          <img
            src="/assets/careerhq-logo.png"
            alt="Career HQ — Connecting Dots Worldwide"
            width={998}
            height={276}
            decoding="async"
            className="h-8 w-auto select-none object-contain transition-opacity duration-200 group-hover:opacity-90 sm:h-9 md:h-10"
          />
        </button>

        {/* Right-aligned Clean Editorial Navigation */}
        <div className="flex items-center gap-4 lg:gap-6">
          <nav aria-label="Primary navigation" className="hidden items-center gap-4 lg:flex xl:gap-6">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative whitespace-nowrap py-1 text-[13px] font-medium tracking-wide transition-colors ${
                    isActive ? 'text-bone' : 'text-mist hover:text-bone'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-line"
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-crimson"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => go('contact')}
            className={`hidden rounded-full border px-4 py-1.5 text-xs font-medium tracking-[0.12em] transition lg:inline-flex ${
              active === 'contact'
                ? 'border-bone bg-bone text-ink'
                : 'border-white/20 text-bone hover:border-bone hover:bg-bone hover:text-ink'
            }`}
          >
            Let&apos;s Build
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileNav((v) => !v)}
            aria-label={mobileNav ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNav}
            className="flex h-10 w-10 flex-col items-end justify-center gap-1.5 lg:hidden"
          >
            <motion.span
              className="block h-[1.5px] w-6 bg-bone"
              animate={{ rotate: mobileNav ? 45 : 0, y: mobileNav ? 3.75 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-[1.5px] w-4 bg-bone"
              animate={{
                width: mobileNav ? 24 : 16,
                rotate: mobileNav ? -45 : 0,
                y: mobileNav ? -3.75 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      {/* Clean Mobile Slide-Down Sheet */}
      <AnimatePresence>
        {mobileNav && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="gutter overflow-hidden border-t border-white/[0.06] bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 py-4">
              {[...navItems, { id: 'contact', label: "Let's Build" }].map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    className={`flex items-center justify-between py-2.5 text-left text-base font-medium transition-colors ${
                      isActive ? 'text-crimson-2' : 'text-bone/85 hover:text-bone'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-crimson" />}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
