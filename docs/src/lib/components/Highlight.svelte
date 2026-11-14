<script lang="ts">
  import IconClipboard from '#lib/icons/IconClipboard.svelte';
  import { onDestroy } from 'svelte';
  import { Highlight, HighlightSvelte } from 'svelte-highlight';
  import markdown from 'svelte-highlight/languages/markdown';
  import plaintext from 'svelte-highlight/languages/plaintext';
  import shell from 'svelte-highlight/languages/shell';
  import typescript from 'svelte-highlight/languages/typescript';
  import { fly } from 'svelte/transition';

  const LANGUAGES = { shell, typescript, plaintext, markdown };

  type Language = keyof typeof LANGUAGES;
  type Tab = { code: string; title: string; language?: Language };

  type Props =
    | { tabs: Tab[]; code?: never; title?: never; language?: never }
    | { tabs?: never; code: string; title?: string; language?: Language };

  let { tabs, code, title, language }: Props = $props();

  let tabIndex = $state(0);
  const currentContent = $derived(tabs ? tabs[tabIndex] : { code: code!, language });

  let copied = $state(false);
  let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

  const copy = () => {
    navigator.clipboard.writeText(currentContent.code);
    copied = true;
    clearTimeout(copiedTimeout);
    copiedTimeout = setTimeout(() => (copied = false), 1000);
  };

  onDestroy(() => clearTimeout(copiedTimeout));
</script>

<div class="tabs">
  {#if tabs}
    {#each tabs as tab, i (tab.title)}
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div class="tab" class:current={i === tabIndex} onclick={() => (tabIndex = i)}>
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
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="copy" onclick={copy}><IconClipboard /></div>
  {#if currentContent.language}
    <Highlight language={LANGUAGES[currentContent.language]} code={currentContent.code} />
  {:else}
    <HighlightSvelte code={currentContent.code} />
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
    color: var(--pico-muted-color);
    width: auto;
    padding: 0.75em 1em 1em;
    border-top-left-radius: var(--pico-border-radius);
    border-top-right-radius: var(--pico-border-radius);
    border: 1px solid transparent;
    margin-left: 0.25em;
    cursor: pointer;
    transition: all 0.2s;
    &:first-child {
      margin-left: 0.75em;
    }
    &:hover {
      background: var(--pico-primary-focus);
      border-bottom-color: var(--pico-muted-border-color);
    }
    &.current {
      cursor: default;
      color: var(--pico-contrast);
      background: var(--pico-code-background-color);
      border-color: var(--pico-muted-border-color);
      border-bottom-color: var(--pico-code-background-color);
    }
  }

  .code {
    position: relative;
    margin-bottom: var(--pico-typography-spacing-vertical);

    :global(code) {
      border: 1px solid var(--pico-muted-border-color);
      background: var(--pico-code-background-color);
    }
  }

  .copied {
    position: absolute;
    top: 0.75em;
    right: 3em;
    font-size: 0.9em;
    color: var(--pico-muted-color);
    background: var(--pico-background-color);
    padding: 0.2em 0.5em;
    border: 1px solid var(--pico-muted-border-color);
    border-radius: var(--pico-border-radius);
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
    background: var(--pico-code-background-color);
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
