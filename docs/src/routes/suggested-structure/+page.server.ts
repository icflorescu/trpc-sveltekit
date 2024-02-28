import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
  codeBlocks: await loadCodeBlocks({
    'suggested-structure.txt': 'misc',
    'bookstall/src/lib/trpc/t.ts': 'example'
  })
});
