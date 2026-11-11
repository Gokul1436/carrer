import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function ensureGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

ensureGsap();

export const GSAP_EASE = 'power3.out';
export const GSAP_EXPO = 'expo.out';

let refreshRaf = 0;

/** Schedules a single ScrollTrigger.refresh() on the next animation frame. */
export function refreshScrollTriggersSoon() {
  if (typeof window === 'undefined') return;
  if (refreshRaf) cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(() => {
    refreshRaf = 0;
    ScrollTrigger.refresh();
  });
}

export { gsap, ScrollTrigger };

