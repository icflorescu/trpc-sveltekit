import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
  codeBlocks: loadCodeBlocks({
    'simple/src/routes/page-data/+page.ts': 'example',
    'simple/src/routes/page-data/+page.svelte': 'example'
  })
});
