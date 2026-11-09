<script lang="ts">
  import { dev } from '$app/env';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import Footer from '#lib/components/layout/Footer.svelte';
  import Header from '#lib/components/layout/Header.svelte';
  import Menu from '#lib/components/layout/Menu.svelte';
  import PageNavigation from '#lib/components/layout/PageNavigation.svelte';
  import { PAGES } from '#lib/constants.ts';
  import '../app.scss';

  let { children } = $props();

  const image = 'https://icflorescu.github.io/trpc-sveltekit/trpc-sveltekit.png';

  const normalize = (path: string) => path.replace(/\/$/, '');

  const currentPageIndex = $derived(
    Math.max(
      0,
      PAGES.findIndex((p) => normalize(resolve(p.path)) === normalize(page.url.pathname))
    )
  );
  const currentPage = $derived(PAGES[currentPageIndex]);

  const title = $derived(
    currentPage.customPageTitle ||
      `${
        typeof currentPage.title === 'string' ? currentPage.title : currentPage.title.join(' ')
      } | tRPC-SvelteKit`
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />
  <meta name="description" content={currentPage.pageDescription} />
  <meta name="author" content="Ionut-Cristian Florescu" />
  <meta property="og:description" content={currentPage.pageDescription} />
  <meta name="twitter:description" content={currentPage.pageDescription} />
  <meta property="og:image" content={image} />
  <meta
    property="og:image:alt"
    content="tRPC-SvelteKit is a tRPC adapter that makes it easy to build end-to-end typesafe APIs for your SvelteKit applications"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:url" content="https://icflorescu.github.io/trpc-sveltekit/" />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:creator" content="@icflorescu" />
  <meta property="og:site_name" content="tRPC-SvelteKit" />
  <meta property="og:type" content="object" />
  {#if !dev}
    <link rel="canonical" href="https://icflorescu.github.io/trpc-sveltekit/" />
  {/if}
</svelte:head>

<Menu />
<Header />
<div>
  <main>
    {@render children()}
    {#if currentPageIndex > 0}<PageNavigation {currentPageIndex} />{/if}
  </main>
</div>
<Footer />

<style lang="scss">
  :root {
    --svelte-orange: #ff3e00;
    --navbar-width: 280px;
    --header-height: 60px;
    --footer-height: 132px;
    @media (min-width: 1024px) {
      --header-height: 70px;
    }
    @media (min-width: 1280px) {
      --navbar-width: 320px;
      --header-height: 80px;
      --footer-height: 70px;
    }
  }

  div {
    background: var(--pico-background-color);
    border-bottom: 1px solid var(--pico-muted-border-color);
    box-shadow: var(--pico-card-box-shadow);
    margin-bottom: calc(var(--footer-height) - 1px);
    @media (min-width: 1024px) {
      margin-left: var(--navbar-width);
    }
  }

  main {
    padding: var(--pico-spacing);
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    max-width: 1024px;
    @media (min-width: 1024px) {
      padding: var(--pico-spacing) calc(var(--pico-spacing) * 2);
      margin: 0 auto;
    }
    @media (min-width: 1600px) {
      max-width: 1200px;
    }
  }
</style>
