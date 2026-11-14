import type { RouteId } from '$app/types';

/**
 * The code blocks shown by each documentation page, as passed to `loadCodeBlocks`.
 * Keys are paths relative to the `examples` folder (`'example'`) or the `docs/misc` folder (`'misc'`).
 *
 * Shared by the pages (`+page.server.ts`) and the `llms-full.txt` generator,
 * so that both always show the same files.
 */
export const CODE_BLOCKS = {
  '/getting-started': {
    'simple/src/lib/trpc/context.ts': 'example',
    'simple/src/lib/trpc/router.ts': 'example',
    'simple/src/hooks.server.ts': 'example',
    'simple/src/lib/trpc/client.ts': 'example',
    'simple/src/routes/+page.svelte': 'example'
  },
  '/page-data': {
    'simple/src/routes/page-data/+page.ts': 'example',
    'simple/src/routes/page-data/+page.svelte': 'example'
  },
  '/page-server-data': {
    'simple/src/routes/page-server-data/+page.server.ts': 'example',
    'simple/src/routes/page-server-data/+page.svelte': 'example'
  },
  '/suggested-structure': {
    'suggested-structure.txt': 'misc',
    'bookstall/src/lib/trpc/t.ts': 'example'
  },
  '/authentication': {
    'bookstall/src/routes/login/+page.server.ts': 'example',
    'bookstall/src/lib/trpc/context.ts': 'example',
    'bookstall/src/lib/trpc/middleware/auth.ts': 'example',
    'bookstall/src/lib/trpc/routes/authors.ts': 'example'
  },
  '/handling-errors': {
    'bookstall/src/routes/authors/+page.svelte': 'example',
    'bookstall/src/hooks.server.ts': 'example'
  },
  '/recipes-and-caveats': {
    'client-options.ts': 'misc',
    'custom-links.ts': 'misc',
    'simple/src/lib/trpc/context.ts': 'example',
    'bookstall/src/lib/trpc/router.ts': 'example',
    'bookstall/src/routes/authors/+page.svelte': 'example'
  },
  '/using-with-svelte-query': {
    'svelte-query.svelte': 'misc'
  },
  '/experimental-websocket-support': {
    'websocket/vite.config.ts': 'example',
    'websocket/wsServer.js': 'example',
    'websocket/src/hooks.server.ts': 'example',
    'websocket/src/lib/trpc/context.ts': 'example',
    'websocket-auth.ts': 'misc',
    'websocket/src/lib/trpc/router.ts': 'example',
    'websocket/src/lib/trpc/client.ts': 'example',
    'websocket/src/routes/messages/+page.svelte': 'example'
  }
} as const satisfies Partial<Record<RouteId, Record<string, 'example' | 'misc'>>>;
