import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
  codeBlocks: loadCodeBlocks({
    'suggested-structure.txt': 'misc',
    'bookstall/src/lib/trpc/t.ts': 'example'
  })
});
