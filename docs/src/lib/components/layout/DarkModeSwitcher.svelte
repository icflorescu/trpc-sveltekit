<script lang="ts">
  import { browser } from '$app/environment';
  import IconMoon from '$lib/icons/IconMoon.svelte';
  import IconSun from '$lib/icons/IconSun.svelte';
  import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
  import atomOneLight from 'svelte-highlight/styles/atom-one-light';

  export let size: string;

  let darkMode = browser ? document.documentElement.getAttribute('data-theme') === 'dark' : true;

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }
</script>

<svelte:head>
  <script>
    let initialMode = localStorage.getItem('theme');
    if (!initialMode) {
      initialMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem('theme', initialMode);
    }
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
  </script>
  {#if darkMode}
    {@html atomOneDark}
  {:else}
    {@html atomOneLight}
  {/if}
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span class="switch" title="Switch to {darkMode ? 'light' : 'dark'} mode" on:click={toggleDarkMode}>
  <span class="sun"><IconSun {size} /></span>
  <span class="moon"><IconMoon {size} /></span>
</span>

<style lang="scss">
  .switch {
    cursor: pointer;
  }

  .moon {
    display: none;
  }

  :global([data-theme='light']) {
    .sun {
      display: none;
    }
    .moon {
      display: inline;
    }
  }
</style>
