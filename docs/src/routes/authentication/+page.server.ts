import { CODE_BLOCKS } from '#lib/codeBlocks.ts';
import loadCodeBlocks from '#lib/loadCodeBlocks.ts';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
  codeBlocks: await loadCodeBlocks(CODE_BLOCKS['/authentication'])
});
