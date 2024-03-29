import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
  codeBlocks: await loadCodeBlocks({
    'bookstall/src/lib/trpc/router.ts': 'example',
    'bookstall/src/routes/authors/+page.svelte': 'example',
    'simple/src/lib/trpc/context.ts': 'example'
  })
});
