<script lang="ts">
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import Logo from '$lib/components/Logo.svelte';
  import { REPO_URL } from '$lib/constants';
  import IconGitHub from '$lib/icons/IconGitHub.svelte';
  import IconMenu from '$lib/icons/IconMenu.svelte';
  import { menuVisible } from '$lib/menuStore';
  import throttle from 'lodash/fp/throttle';
  import DarkModeSwitcher from './DarkModeSwitcher.svelte';

  let scrolled = browser ? window.scrollY > 0 : false;

  const showMenu = () => {
    menuVisible.set(true);
  };

  const handleScroll = throttle(250, () => {
    scrolled = window.scrollY > 0;
  });
</script>

<svelte:window on:scroll={handleScroll} />
<div class="root" class:scrolled>
  <div class="background" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="menu-button" aria-label="Show menu" on:click={showMenu}>
    <IconMenu size="1.25em" />
  </div>
  <a href={base} class="home-link" class:hidden={$menuVisible}>
    <h1>
      <span class="logo"><Logo /></span>tRPC-SvelteKit
      <code class="version">v{$page.data.version}</code>
    </h1>
  </a>
  <div class="tagline">End-to-end typesafe APIs for your SvelteKit applications</div>
  <div>
    <!-- svelte-ignore security-anchor-rel-noreferrer -->
    <a class="repo-link" href={REPO_URL} target="_blank" title="Source code">
      <IconGitHub size="1.25em" />
    </a>
    <DarkModeSwitcher size="1.25em" />
  </div>
</div>

<style lang="scss">
  .root {
    z-index: 2;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--header-height);
    padding: 0 var(--spacing);
    border-bottom: 1px solid var(--muted-border-color);
    backdrop-filter: blur(3px);
    &.scrolled {
      box-shadow: var(--card-box-shadow);
    }
  }

  .background {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--card-background-color);
    opacity: 0.85;
  }

  .menu-button {
    @media (min-width: 1024px) {
      display: none;
    }
  }

  .home-link {
    transition: all 0.2s;
    text-decoration: none;
    &.hidden {
      transform: scale3d(0.5, 0.5, 1);
      opacity: 0;
    }
  }

  h1 {
    margin: 0;
    font-weight: normal;
    font-size: 1.5em;
    @media (min-width: 1024px) {
      font-size: 1.75em;
    }
    @media (min-width: 1280px) {
      font-size: 2.25em;
    }
  }

  .logo {
    margin-right: 0.3em;
    vertical-align: 0.1em;
  }

  .version {
    font-size: 1rem;
    vertical-align: text-top;
    border: 1px solid var(--muted-border-color);
    padding: 0.2rem 0.5rem;
    display: none;
    @media (min-width: 400px) {
      display: inline;
    }
  }

  .tagline {
    display: none;
    @media (min-width: 1024px) {
      display: block;
      font-size: 1.25em;
      color: var(--muted-color);
      margin-bottom: -0.25em;
    }
  }

  .repo-link {
    color: inherit;
    margin-right: var(--spacing);
    &:focus {
      background: none;
    }
  }
</style>
