import { getLlmsTxt } from '#lib/server/llms.ts';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({ llmsTxt: getLlmsTxt() });
