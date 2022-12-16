import { browser } from '$app/environment';
import { readable } from 'svelte/store';

export const useMediaQuery = (mediaQueryString: string) => {
  const matches = readable<null | boolean>(null, (set) => {
    if (!browser) return;
    const m = window.matchMedia(mediaQueryString);
    set(m.matches);
    const el = (e: MediaQueryListEvent) => set(e.matches);
    m.addEventListener('change', el);
    return () => {
      m.removeEventListener('change', el);
    };
  });
  return matches;
};
