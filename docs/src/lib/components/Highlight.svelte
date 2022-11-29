<script lang="ts">
  import IconClipboard from '$lib/icons/IconClipboard.svelte';
  import { onDestroy } from 'svelte';
  import { Highlight, HighlightSvelte } from 'svelte-highlight';
  import plaintext from 'svelte-highlight/languages/plaintext';
  import shell from 'svelte-highlight/languages/shell';
  import typescript from 'svelte-highlight/languages/typescript';
  import { fly } from 'svelte/transition';

  type Language = 'shell' | 'typescript' | 'plaintext';

  type $$Props =
    | {
        tabs: {
          code: string;
          title: string;
          language?: Language;
        }[];
        code?: never;
        title?: never;
        language?: never;
      }
    | {
        tabs?: never;
        code: string;
        title?: string;
        language?: Language;
      };

  export let tabs:
    | {
        code: string;
        title: string;
        language?: Language;
      }[]
    | undefined = undefined;
  export let code: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let language: string | undefined = undefined;

  let tabIndex = 0;

  $: currentContent = tabs ? tabs[tabIndex] : { code, language };
  $: currentContentLanguage = currentContent.language;
  $: currentContentCode = currentContent.code;

  let copied = false;
  let copiedTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  const copy = () => {
    navigator.clipboard.writeText(currentContentCode!);
    copied = true;
    copiedTimeout = setTimeout(() => (copied = false), 1000);
  };

  onDestroy(() => {
    clearTimeout(copiedTimeout);
  });
</script>

<div class="tabs">
  {#if tabs}
    {#each tabs as tab, i (tab.title)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="tab"
        class:current={i === tabIndex}
        on:click={() => {
          tabIndex = i;
        }}
      >
        {tab.title}
      </div>
    {/each}
  {:else if title}
    <div class="tab current">{title}</div>
  {/if}
</div>
<div class="code">
  {#if copied}
    <div
      class="copied"
      in:fly={{ y: 5, duration: 100, opacity: 0 }}
      out:fly={{ y: -5, duration: 300, opacity: 0 }}
    >
      Code copied...
    </div>
  {/if}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="copy" on:click={copy}><IconClipboard /></div>
  {#if currentContentLanguage}
    <Highlight
      language={currentContentLanguage === 'shell'
        ? shell
        : currentContentLanguage === 'plaintext'
        ? plaintext
        : typescript}
      code={currentContentCode}
    />
  {:else}
    <HighlightSvelte code={currentContentCode} />
  {/if}
</div>

<style lang="scss">
  .tabs {
    position: relative;
    z-index: 1;
    display: flex;
    margin-bottom: -1px;
  }

  .tab {
    font-size: 0.8em;
    font-weight: 500;
    color: var(--muted-color);
    width: auto;
    padding: 0.75em 1em 1em;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border: 1px solid transparent;
    margin-left: 0.25em;
    cursor: pointer;
    transition: all 0.2s;
    &:first-child {
      margin-left: 0.75em;
    }
    &:hover {
      background: var(--primary-focus);
      border-bottom-color: var(--muted-border-color);
    }
    &.current {
      cursor: default;
      color: var(--contrast);
      background: var(--code-background-color);
      border-color: var(--muted-border-color);
      border-bottom-color: var(--code-background-color);
    }
  }

  .code {
    position: relative;
    margin-bottom: var(--typography-spacing-vertical);

    :global(code) {
      border: 1px solid var(--muted-border-color);
      background: var(--code-background-color);
    }
  }

  .copied {
    position: absolute;
    top: 0.75em;
    right: 3em;
    font-size: 0.9em;
    color: var(--muted-color);
    background: var(--background-color);
    padding: 0.2em 0.5em;
    border: 1px solid var(--muted-border-color);
    border-radius: var(--border-radius);
  }

  .copy {
    position: absolute;
    top: 0.25em;
    right: 0.3em;
    width: 2.5em;
    height: 2.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--code-background-color);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    @media (pointer: coarse) {
      opacity: 0.75;
    }
  }

  .code:hover .copy {
    opacity: 0.75;
  }
</style>
