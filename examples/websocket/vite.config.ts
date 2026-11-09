import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({ adapter: adapter(), preprocess: vitePreprocess() }),
    vitePluginTrpcWebSocket
  ]
});
