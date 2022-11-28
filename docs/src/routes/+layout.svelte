<script lang="ts">
  import { page } from '$app/stores';
  import Footer from '$lib/components/layout/Footer.svelte';
  import Header from '$lib/components/layout/Header.svelte';
  import Menu from '$lib/components/layout/Menu.svelte';
  import PageNavigation from '$lib/components/layout/PageNavigation.svelte';
  import { PAGES } from '$lib/constants';
  import '../app.scss';

  $: currentPageIndex = PAGES.findIndex((p) => p.path === $page.url.pathname);
  $: currentPage = PAGES[currentPageIndex];
</script>

<svelte:head>
  <title>{currentPage.customPageTitle || `${currentPage.title} | tRPC-SvelteKit`}</title>
  <meta name="description" content={currentPage.pageDescription} />
</svelte:head>

<Menu />
<Header />
<div>
  <main>
    <slot />
    {#if currentPageIndex > 0}<PageNavigation {currentPageIndex} />{/if}
  </main>
</div>
<Footer />

<style lang="scss">
  :root {
    --svelte-orange: #ff3e00;
    --navbar-width: 280px;
    --header-height: 60px;
    --footer-height: 112px;
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
    background: var(--background-color);
    border-bottom: 1px solid var(--muted-border-color);
    box-shadow: var(--card-box-shadow);
    margin-bottom: calc(var(--footer-height) - 1px);
    @media (min-width: 1024px) {
      margin-left: var(--navbar-width);
    }
  }

  main {
    padding: var(--spacing);
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    max-width: 1024px;
    @media (min-width: 1024px) {
      padding: var(--spacing) calc(var(--spacing) * 2);
      margin: 0 auto;
    }
    @media (min-width: 1600px) {
      max-width: 1200px;
    }
  }
</style>
