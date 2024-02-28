import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import { vitePluginTrpcWebSocket } from '../../package/src/websocket';
// Replace the above in your project with:
// import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket';

const config: UserConfig = {
  plugins: [sveltekit(), vitePluginTrpcWebSocket]
};

export default config;
