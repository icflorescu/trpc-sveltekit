import { getLlmsFullTxt } from '#lib/server/llms.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () =>
  new Response(await getLlmsFullTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
