import { GITHUB_PAGES_ROOT } from '$lib/constants';
import type { RequestHandler } from './$types';

export const prerender = true;

const ICON_SIZES = [192, 512];

export const GET: RequestHandler = () => {
  return new Response(
    JSON.stringify({
      name: 'tRPC-SvelteKit',
      short_name: 'tRPC-SvelteKit',
      start_url: './',
      scope: '.',
      icons: ICON_SIZES.map((size) => ({
        src: `${GITHUB_PAGES_ROOT}/android-chrome-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png'
      })),
      theme_color: '#141e26',
      background_color: '#141e26',
      display: 'standalone'
    })
  );
};
