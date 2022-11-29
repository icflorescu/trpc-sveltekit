import { GITHUB_PAGES_ROOT } from '$lib/constants';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      `Host: ${GITHUB_PAGES_ROOT}/`,
      `Sitemap: ${GITHUB_PAGES_ROOT}/sitemap.xml`
    ].join('\n')
  );
};
