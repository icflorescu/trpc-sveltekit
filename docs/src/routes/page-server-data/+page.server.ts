import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
  codeBlocks: loadCodeBlocks({
    'simple/src/routes/page-server-data/+page.server.ts': 'example',
    'simple/src/routes/page-server-data/+page.svelte': 'example'
  })
});
