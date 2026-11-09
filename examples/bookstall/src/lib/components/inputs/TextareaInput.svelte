<script lang="ts">
  import { browser } from '$app/env';
  import LabelAsterisk from './LabelAsterisk.svelte';

  let textarea: HTMLTextAreaElement;

  export let name: string;
  export let label: string;
  export let required = false;
  export let placeholder = '';
  export let item: Record<string, unknown> | null;
  export let errors: { message: string; path: string[] }[] | null = null;

  $: error = errors?.find((e) => e.path.includes(name));

  const autosize = () => {
    if (browser) {
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.style.height = '0';
          textarea.style.height = `${textarea.scrollHeight + 2}px`;
        }
      });
    }
  };

  $: item?.[name], autosize();
  $: value = item?.[name] as string;
</script>

<label>
  {label}<LabelAsterisk {required} />
  <textarea
    bind:this={textarea}
    {name}
    {placeholder}
    {required}
    {value}
    on:input={autosize}
    aria-invalid={error ? 'true' : undefined}></textarea>
  {#if error}
    <small>{error.message}</small>
  {/if}
</label>

<style>
  textarea {
    resize: none;
    min-height: calc(
      var(--line-height) * var(--pico-font-size) +
        (var(--border-width) + var(--pico-form-element-spacing-vertical)) * 2
    );
    max-height: 200px;
    margin-bottom: 0.5em;
  }

  small {
    color: var(--pico-form-element-invalid-active-border-color);
  }
</style>
