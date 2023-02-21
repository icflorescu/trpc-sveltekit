<script lang="ts">
  import { page } from '$app/stores';

  export let to: string;
  export let title: string | string[];
</script>

<a class:current={$page.url.pathname === to} href={to}>
  <slot name="icon" />
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
    padding: var(--spacing);
    font-weight: 500;
    color: inherit;
    border-radius: 0;
    &:hover {
      background: var(--primary-focus);
    }
    &.current {
      &,
      &:hover {
        cursor: default;
        color: var(--contrast);
        background: var(--muted-border-color);
      }
    }
  }

  :global(svg) {
    margin-top: 0.25em;
  }
</style>
