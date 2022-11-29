import { GITHUB_PAGES_ROOT, PAGES } from '$lib/constants';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
  const date = new Date().toISOString();
  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      `<url><loc>${GITHUB_PAGES_ROOT}</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      ...PAGES.map(
        ({ path }) =>
          `<url><loc>${GITHUB_PAGES_ROOT}/${path}</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      ),
      '</urlset>'
    ].join('\n')
  );
};
