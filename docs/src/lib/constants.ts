import IconFileCode from '$lib/icons/IconFileCode.svelte';
import IconFileDatabase from '$lib/icons/IconFileDatabase.svelte';
import IconFolder from '$lib/icons/IconFolder.svelte';
import IconHome from '$lib/icons/IconHome.svelte';
import IconLock from '$lib/icons/IconLock.svelte';
import IconRocket from '$lib/icons/IconRocket.svelte';
import IconTools from '$lib/icons/IconTools.svelte';
import IconHeartHandshake from './icons/IconHeartHandshake.svelte';
import IconLifeBuoy from './icons/IconLifeBuoy.svelte';

export const AUTHOR_URL = 'https://github.com/icflorescu';
export const REPO_URL = `${AUTHOR_URL}/trpc-sveltekit`;
export const BADGE_COLOR_CODE = '1095c1';
export const BASE_PATH = process.env.GITHUB_PAGES === 'true' ? '/trpc-sveltekit' : '';

export const PAGES: {
  title: string;
  path: string;
  icon: typeof IconHome;
  customPageTitle?: string;
  pageDescription: string;
}[] = [
  {
    title: 'Home',
    path: `${BASE_PATH}/`,
    icon: IconHome,
    customPageTitle: 'tRPC-SvelteKit: end-to-end typesafe APIs for your SvelteKit applications',
    pageDescription:
      'tRPC-SvelteKit is a tRPC adapter that makes it easy to build end-to-end typesafe APIs for your SvelteKit applications.'
  },
  {
    title: 'Getting started',
    path: `${BASE_PATH}/getting-started`,
    icon: IconRocket,
    pageDescription: 'Get started with tRPC-SvelteKit'
  },
  {
    title: 'Page data',
    path: `${BASE_PATH}/page-data`,
    icon: IconFileCode,
    pageDescription: 'How to load SvelteKit page data with tRPC'
  },
  {
    title: 'Page server data',
    path: `${BASE_PATH}/page-server-data`,
    icon: IconFileDatabase,
    pageDescription: 'How to load SvelteKit server data with tRPC'
  },
  {
    title: 'Suggested structure',
    path: `${BASE_PATH}/suggested-structure`,
    icon: IconFolder,
    pageDescription: 'Suggested structure for a tRPC-SvelteKit application'
  },
  {
    title: 'Authentication',
    path: `${BASE_PATH}/authentication`,
    icon: IconLock,
    pageDescription: 'How to add authentication to a tRPC-SvelteKit application'
  },
  {
    title: 'Recipes and caveats',
    path: `${BASE_PATH}/recipes-and-caveats`,
    icon: IconTools,
    pageDescription: 'Recipes and caveats for tRPC-SvelteKit'
  },
  {
    title: 'Contribute and support',
    path: `${BASE_PATH}/contribute-and-support`,
    icon: IconLifeBuoy,
    pageDescription: 'Contribute to tRPC-SvelteKit and support the project'
  },
  {
    title: 'Hire the author',
    path: `${BASE_PATH}/hire-the-author`,
    icon: IconHeartHandshake,
    pageDescription: 'Hire the author of tRPC-SvleteKit'
  }
];
