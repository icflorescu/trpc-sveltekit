<script lang="ts">
  import { page } from '$app/state';
  import type { IconProps } from '#lib/icons/types.ts';
  import type { Component } from 'svelte';

  type Props = {
    to: string;
    title: string | string[];
    icon: Component<IconProps>;
    /** Open the link in a new tab (for links outside the docs website) */
    external?: boolean;
  };

  let { to, title, icon: Icon, external = false }: Props = $props();
</script>

<a
  class:current={page.url.pathname === to}
  href={to}
  target={external ? '_blank' : undefined}
  rel={external ? 'noreferrer' : undefined}
>
  <Icon />
  {#if typeof title === 'string'}
    {title}
  {:else}
    {#each title as part, index (part)}
      {#if index > 0}
        <br />
      {/if}
      {part}
    {/each}
  {/if}
</a>

<style lang="scss">
  a {
    display: flex;
    gap: 0.75em;
    margin: 0;
    padding: var(--pico-spacing);
    font-weight: 500;
    color: inherit;
    border-radius: 0;
    &:hover {
      background: var(--pico-primary-focus);
    }
    &.current {
      &,
      &:hover {
        cursor: default;
        color: var(--pico-contrast);
        background: var(--pico-muted-border-color);
      }
    }
  }

  :global(svg) {
    margin-top: 0.25em;
  }
</style>
