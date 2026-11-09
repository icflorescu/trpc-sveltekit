import loadCodeBlocks from '#lib/loadCodeBlocks.ts';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
  codeBlocks: await loadCodeBlocks({ 'svelte-query.svelte': 'misc' })
});
