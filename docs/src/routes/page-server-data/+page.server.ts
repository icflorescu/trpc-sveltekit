import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
  codeBlocks: await loadCodeBlocks({
    'simple/src/routes/page-server-data/+page.server.ts': 'example',
    'simple/src/routes/page-server-data/+page.svelte': 'example'
  })
});
