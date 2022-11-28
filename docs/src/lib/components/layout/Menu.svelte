<script lang="ts">
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import Logo from '$lib/components/Logo.svelte';
  import { PAGES } from '$lib/constants';
  import { menuVisible } from '$lib/menuStore';
  import MenuLink from './MenuLink.svelte';

  $: {
    if (browser) {
      if ($menuVisible) {
        document.body.classList.add('modal-is-open');
      } else {
        document.body.classList.remove('modal-is-open');
      }
    }
  }

  function hide() {
    menuVisible.set(false);
  }
</script>

<svelte:window on:resize={hide} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="backdrop" class:visible={$menuVisible} on:click={hide} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<aside class:visible={$menuVisible} on:click={hide}>
  <header>
    <div class="title"><span class="logo"><Logo /></span>tRPC-SvelteKit</div>
    <div class="hide-button" aria-label="Hide menu" />
  </header>
  <nav>
    {#each PAGES as { path, title, icon: Icon } (path)}
      <MenuLink to="{base}{path}" {title}><Icon slot="icon" /></MenuLink>
    {/each}
  </nav>
</aside>

<style lang="scss">
  .backdrop {
    position: fixed;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.2s;
    background: rgba(black, 0.5);
    backdrop-filter: blur(3px);
    pointer-events: none;
    @media (min-width: 1024px) {
      display: none;
    }
    &.visible {
      opacity: 1;
      pointer-events: all;
    }
  }

  aside {
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--navbar-width);
    background: var(--card-background-color);
    border-right: 1px solid var(--muted-border-color);
    display: flex;
    flex-direction: column;
    transform: translate3d(-100%, 0, 0);
    transition: all 0.2s;
    box-shadow: none;
    pointer-events: all;
    &.visible {
      transform: translate3d(0, 0, 0);
      box-shadow: var(--card-box-shadow);
    }
    @media (min-width: 1024px) {
      top: var(--header-height);
      transform: translate3d(0, 0, 0);
    }
  }

  header {
    flex-shrink: 0;
    height: var(--header-height);
    border-bottom: 1px solid var(--muted-border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing);
    @media (min-width: 1024px) {
      display: none;
    }
  }

  .title {
    font-size: 1.5em;
  }

  .logo {
    margin-right: 0.3em;
    vertical-align: text-bottom;
  }

  .hide-button {
    width: 1rem;
    height: 1rem;
    background: var(--icon-close) center/auto 1rem no-repeat;
  }

  nav {
    font-size: 1.1em;
    overflow: auto;
  }
</style>
