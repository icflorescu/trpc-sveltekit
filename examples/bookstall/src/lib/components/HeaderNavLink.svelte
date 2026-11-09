<script lang="ts">
  import { page } from '$app/state';
  import { createEventDispatcher } from 'svelte';

  export let to: string | undefined = undefined;
  export let title: string;

  const dispatch = createEventDispatcher();

  const handleClick = (e: MouseEvent) => {
    if (!to) {
      e.preventDefault();
      dispatch('click');
    }
  };
</script>

<li>
  <a class:active={page.url.pathname === to} href={to || '#'} on:click={handleClick}>{title}</a>
</li>

<style lang="scss">
  li:not(:first-child) {
    position: relative;
    &::before {
      content: '·';
      display: inline-block;
      width: 2em;
      position: absolute;
      left: -1em;
      pointer-events: none;
    }
  }

  a {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: calc(var(--pico-spacing) * 0.75);
      left: calc(var(--pico-spacing) * 0.5);
      right: calc(var(--pico-spacing) * 0.5);
      height: 2px;
      background: var(--pico-color);
      transform: scaleX(0);
      transition: transform 0.2s;
    }
  }

  .active::after {
    transform: scaleX(1);
  }
</style>
