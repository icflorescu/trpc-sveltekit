import { getLlmsTxt } from '#lib/server/llms.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () =>
  new Response(getLlmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
