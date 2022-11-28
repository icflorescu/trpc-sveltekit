<script lang="ts">
  import LogoSvelte from '$lib/components/home/LogoSvelte.svelte';
  import LogoTrpc from '$lib/components/home/LogoTrpc.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import { onMount } from 'svelte';

  let visible = false;

  onMount(() => {
    const timeout = setTimeout(() => {
      visible = true;
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  });
</script>

<div>
  <span class="dep" class:visible><LogoTrpc height="46%" /></span>
  <span class="mine" class:visible><Logo height="100%" /></span>
  <span class="dep" class:visible><LogoSvelte height="50%" /></span>
</div>

<style lang="scss">
  div {
    display: none;
    @media (min-width: 1024px) {
      display: block;
      width: fit-content;
      height: 8em;
      margin: 4em auto 2em;
    }
    @media (min-width: 1280px) {
      height: 12em;
    }
  }

  .mine,
  .dep {
    position: relative;
  }

  .dep {
    > :global(svg) {
      transition: all 1s;
      opacity: 1;
    }
    &.visible {
      > :global(svg) {
        opacity: 0;
      }
      &:first-child > :global(svg) {
        transform: scale3d(1.5, 1.5, 1) translate3d(80%, 0, 0);
      }
      &:last-child > :global(svg) {
        transform: scale3d(1.5, 1.5, 1) translate3d(-80%, 0, 0);
      }
    }
  }

  .mine {
    margin: 0 -3em;
    z-index: 1;
    & > :global(svg) {
      transition: all 1s 0.2s;
      transform: scale3d(0.5, 0.5, 1);
      opacity: 0;
    }
    &.visible > :global(svg) {
      transform: none;
      opacity: 1;
    }
  }
</style>
