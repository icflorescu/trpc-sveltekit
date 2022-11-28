import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
  codeBlocks: loadCodeBlocks({
    'simple/src/lib/trpc/context.ts': 'example',
    'simple/src/lib/trpc/router.ts': 'example',
    'simple/src/hooks.server.ts': 'example',
    'simple/src/lib/trpc/client.ts': 'example',
    'simple/src/routes/+page.svelte': 'example'
  })
});
