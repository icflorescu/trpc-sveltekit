import loadCodeBlocks from '$lib/loadCodeBlocks';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
  codeBlocks: await loadCodeBlocks({
    'bookstall/src/routes/login/+page.server.ts': 'example',
    'bookstall/src/lib/trpc/context.ts': 'example',
    'bookstall/src/lib/trpc/middleware/auth.ts': 'example',
    'bookstall/src/lib/trpc/routes/authors.ts': 'example'
  })
});
