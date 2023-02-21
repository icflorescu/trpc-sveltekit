import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    // this is only needed for the example app in trpc-sveltekit monorepo
    // you can remove this in your own app, since you'll be installing the package from npm
    alias: {
      'trpc-sveltekit':
        process.env.NODE_ENV === 'production' ? '../../package/dist' : '../../package/src'
    }
  }
};

export default config;
