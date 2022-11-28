<script lang="ts">
  import { page } from '$app/stores';

  export let to: string;
  export let title: string;
</script>

<a class:current={$page.url.pathname === to} href={to}>
  <slot name="icon" />
  {title}
</a>

<style lang="scss">
  a {
    display: flex;
    align-items: center;
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
</style>
