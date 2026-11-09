<script lang="ts">
  import { browser } from '$app/env';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import Logo from '#lib/components/Logo.svelte';
  import { REPO_URL } from '#lib/constants.ts';
  import IconGitHub from '#lib/icons/IconGitHub.svelte';
  import IconMenu from '#lib/icons/IconMenu.svelte';
  import { menu } from '#lib/menu.svelte.ts';
  import DarkModeSwitcher from './DarkModeSwitcher.svelte';

  let scrolled = $state(browser ? window.scrollY > 0 : false);

  let scrollFrame = 0;
  const handleScroll = () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      scrolled = window.scrollY > 0;
    });
  };
</script>

<svelte:window onscroll={handleScroll} />
<div class="root" class:scrolled>
  <div class="background"></div>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="menu-button" aria-label="Show menu" onclick={() => (menu.visible = true)}>
    <IconMenu size="1.25em" />
  </div>
  <a href={resolve('/')} class="home-link" class:hidden={menu.visible}>
    <h1>
      <span class="logo"><Logo /></span>tRPC-SvelteKit
      <code class="version">v{page.data.version}</code>
    </h1>
  </a>
  <div class="tagline">End-to-end typesafe APIs for your SvelteKit applications</div>
  <div>
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
    padding: 0 var(--pico-spacing);
    border-bottom: 1px solid var(--pico-muted-border-color);
    backdrop-filter: blur(3px);
    &.scrolled {
      box-shadow: var(--pico-card-box-shadow);
    }
  }

  .background {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--pico-card-background-color);
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
    vertical-align: 0.2em;
  }

  .version {
    font-size: 1rem;
    vertical-align: text-top;
    border: 1px solid var(--pico-muted-border-color);
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
      color: var(--pico-muted-color);
      margin-bottom: -0.25em;
    }
  }

  .repo-link {
    color: inherit;
    margin-right: var(--pico-spacing);
    &:focus {
      background: none;
    }
  }
</style>
