import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    paths: {
      base: isGitHubPages ? '/trpc-sveltekit' : '',
      assets: isGitHubPages ? 'https://github.com/icflorescu/trpc-sveltekit' : undefined
    },
    appDir: 'internal'
  }
};

export default config;
