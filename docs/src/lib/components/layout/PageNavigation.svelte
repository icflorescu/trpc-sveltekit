<script lang="ts">
  import { resolve } from '$app/paths';
  import { PAGES } from '#lib/constants.ts';
  import IconArrowLeft from '#lib/icons/IconArrowLeft.svelte';
  import IconArrowRight from '#lib/icons/IconArrowRight.svelte';

  let { currentPageIndex }: { currentPageIndex: number } = $props();

  const previousPage = $derived(PAGES[currentPageIndex - 1]);
  const nextPage = $derived(PAGES[currentPageIndex + 1]);

  // titles split into lines for the menu are shown on a single line here
  const titleText = (title: string | string[]) =>
    typeof title === 'string' ? title : title.join(' ');
</script>

<div class="root">
  <a class="prev" class:without-next={!nextPage} href={resolve(previousPage.path)}>
    <IconArrowLeft size="1.25em" />
    <div>
      <div class="dir">Go back</div>
      <div>{titleText(previousPage.title)}</div>
    </div>
  </a>
  {#if nextPage}
    <a href={resolve(nextPage.path)}>
      <div>
        <div class="dir">Up next</div>
        <div>{titleText(nextPage.title)}</div>
      </div>
      <IconArrowRight size="1.25em" />
    </a>
  {/if}
</div>

<style lang="scss">
  .root {
    margin: 2em 0 1em;
    display: flex;
    flex-direction: column-reverse;
    row-gap: var(--pico-spacing);
    @media (min-width: 512px) {
      flex-direction: row;
      column-gap: calc(var(--pico-spacing) * 1.5);
    }
  }

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em 1em;
    text-decoration: none;
    color: var(--pico-muted-color);
    background: var(--pico-card-background-color);
    border: 1px solid var(--pico-muted-border-color);
    border-radius: var(--pico-border-radius);
    @media (pointer: fine) {
      &:hover {
        background: var(--pico-muted-border-color);
      }
    }
    &:active {
      background: var(--pico-primary-focus);
    }
    &.prev {
      text-align: right;
    }
    @media (min-width: 512px) {
      width: calc(50% - (var(--pico-spacing) * 0.75));
      &.without-next {
        width: 100%;
      }
    }
  }

  .dir {
    font-weight: bold;
  }
</style>
