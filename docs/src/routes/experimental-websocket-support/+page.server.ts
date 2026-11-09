import loadCodeBlocks from '#lib/loadCodeBlocks.ts';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({
  codeBlocks: await loadCodeBlocks({
    'websocket/vite.config.ts': 'example',
    'websocket/wsServer.js': 'example',
    'websocket/src/hooks.server.ts': 'example',
    'websocket/src/lib/trpc/context.ts': 'example',
    'websocket/src/lib/trpc/router.ts': 'example',
    'websocket/src/lib/trpc/client.ts': 'example',
    'websocket/src/routes/messages/+page.svelte': 'example'
  })
});
