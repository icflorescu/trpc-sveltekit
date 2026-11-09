import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      preprocess: vitePreprocess(),
      paths: { base: '/trpc-sveltekit', relative: false },
      appDir: 'internal'
    })
  ],
  css: {
    preprocessorOptions: {
      // Pico CSS v1 still uses Sass @import
      scss: { silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'] }
    }
  }
});
