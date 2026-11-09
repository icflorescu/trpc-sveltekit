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
    // Pico CSS uses the Sass if() function, which is deprecated
    preprocessorOptions: { scss: { silenceDeprecations: ['if-function'] } }
  }
});
