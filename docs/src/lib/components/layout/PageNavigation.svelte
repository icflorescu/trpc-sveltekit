<script lang="ts">
  import { PAGES } from '$lib/constants';
  import IconArrowLeft from '$lib/icons/IconArrowLeft.svelte';
  import IconArrowRight from '$lib/icons/IconArrowRight.svelte';

  export let currentPageIndex: number;

  $: previousPage = PAGES[currentPageIndex - 1];
  $: nextPage = PAGES[currentPageIndex + 1];
</script>

<div class="root">
  <a class="prev" href={previousPage.path}>
    <IconArrowLeft size="1.25em" />
    <div>
      <div class="dir">Go back</div>
      <div>{previousPage.title}</div>
    </div>
  </a>
  {#if nextPage}
    <a href={nextPage.path}>
      <div>
        <div class="dir">Up next</div>
        <div>{nextPage.title}</div>
      </div>
      <IconArrowRight size="1.25em" />
    </a>
  {/if}
</div>

<style lang="scss">
  .root {
    margin: 2em 0 1em;
    display: flex;
    flex-direction: column;
    row-gap: var(--spacing);
    @media (min-width: 512px) {
      flex-direction: row;
      column-gap: calc(var(--spacing) * 1.5);
    }
  }

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em 1em;
    text-decoration: none;
    color: var(--muted-color);
    background: var(--card-background-color);
    border: 1px solid var(--muted-border-color);
    border-radius: var(--border-radius);
    @media (pointer: fine) {
      &:hover {
        background: var(--muted-border-color);
      }
    }
    &:active {
      background: var(--primary-focus);
    }
    &.prev {
      text-align: right;
    }
    @media (min-width: 512px) {
      width: calc(50% - (var(--spacing) * 0.75));
    }
  }

  .dir {
    font-weight: bold;
  }
</style>
