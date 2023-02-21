import IconFileCode from '$lib/icons/IconFileCode.svelte';
import IconFileDatabase from '$lib/icons/IconFileDatabase.svelte';
import IconFolder from '$lib/icons/IconFolder.svelte';
import IconHome from '$lib/icons/IconHome.svelte';
import IconLock from '$lib/icons/IconLock.svelte';
import IconRocket from '$lib/icons/IconRocket.svelte';
import IconTools from '$lib/icons/IconTools.svelte';
import IconBulb from './icons/IconBulb.svelte';
import IconErrorHandling from './icons/IconErrorHandling.svelte';
import IconHeartHandshake from './icons/IconHeartHandshake.svelte';
import IconLifeBuoy from './icons/IconLifeBuoy.svelte';
import IconSpeakerphone from './icons/IconSpeakerphone.svelte';
import IconWebSocket from './icons/IconWebSocket.svelte';

export const GITHUB_PAGES_ROOT = 'https://icflorescu.github.io/trpc-sveltekit';
export const AUTHOR_URL = 'https://github.com/icflorescu';
export const REPO_URL = `${AUTHOR_URL}/trpc-sveltekit`;
export const BADGE_COLOR_CODE = '1095c1';

export const PAGES: {
  title: string | string[];
  path: string;
  icon: typeof IconHome;
  customPageTitle?: string;
  pageDescription: string;
}[] = [
  {
    title: 'Home',
    path: '/',
    icon: IconHome,
    customPageTitle: 'tRPC-SvelteKit: end-to-end typesafe APIs for your SvelteKit applications',
    pageDescription:
      'tRPC-SvelteKit is a tRPC adapter that makes it easy to build end-to-end typesafe APIs for your SvelteKit applications.'
  },
  {
    title: 'Getting started',
    path: '/getting-started',
    icon: IconRocket,
    pageDescription: 'Get started with tRPC-SvelteKit'
  },
  {
    title: 'Page data',
    path: '/page-data',
    icon: IconFileCode,
    pageDescription: 'How to load SvelteKit page data with tRPC'
  },
  {
    title: 'Page server data',
    path: '/page-server-data',
    icon: IconFileDatabase,
    pageDescription: 'How to load SvelteKit server data with tRPC'
  },
  {
    title: 'Suggested structure',
    path: '/suggested-structure',
    icon: IconFolder,
    pageDescription: 'Suggested structure for a tRPC-SvelteKit application'
  },
  {
    title: 'Authentication',
    path: '/authentication',
    icon: IconLock,
    pageDescription: 'How to add authentication to a tRPC-SvelteKit application'
  },
  {
    title: 'Handling errors',
    path: '/handling-errors',
    icon: IconErrorHandling,
    pageDescription: 'How to handle errors in a tRPC-SvelteKit application'
  },
  {
    title: 'Recipes and caveats',
    path: '/recipes-and-caveats',
    icon: IconTools,
    pageDescription: 'Recipes and caveats for tRPC-SvelteKit'
  },
  {
    title: 'Using with Svelte Query',
    path: '/using-with-svelte-query',
    icon: IconBulb,
    pageDescription: 'How to use tRPC-SvelteKit with Svelte Query'
  },
  {
    title: ['WebSocket support', '(experimental)'],
    path: '/experimental-websocket-support',
    icon: IconWebSocket,
    pageDescription: 'Experimental WebSocket support in tRPC-SvelteKit'
  },
  {
    title: 'Contribute and support',
    path: '/contribute-and-support',
    icon: IconLifeBuoy,
    pageDescription: 'Contribute to tRPC-SvelteKit and support the project'
  },
  {
    title: 'Acknowledgements',
    path: '/acknowledgements',
    icon: IconSpeakerphone,
    pageDescription: 'Huge thanks to tRPC-SvelteKit sponsors'
  },
  {
    title: 'Hire the author',
    path: '/hire-the-author',
    icon: IconHeartHandshake,
    pageDescription: 'Hire the author of tRPC-SvleteKit'
  }
];
