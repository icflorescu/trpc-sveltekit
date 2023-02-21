import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

// import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket';
import { vitePluginTrpcWebSocket } from '../../package/src/websocket';

const config: UserConfig = {
  plugins: [sveltekit(), vitePluginTrpcWebSocket]
};

export default config;
