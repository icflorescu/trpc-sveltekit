<script lang="ts">
  import LabelAsterisk from './LabelAsterisk.svelte';

  type Props = {
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    item: Record<string, unknown> | null;
    errors?: { message: string; path: string[] }[] | null;
  };

  let { name, label, required = false, placeholder = '', item, errors = null }: Props = $props();

  let textarea: HTMLTextAreaElement | undefined = $state();

  const value = $derived(item?.[name] as string | undefined);
  const error = $derived(errors?.find((e) => e.path.includes(name)));

  const autosize = () => {
    if (!textarea) return;
    textarea.style.height = '0';
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  };

  // Resize whenever the edited value changes
  $effect(() => {
    void value;
    requestAnimationFrame(autosize);
  });
</script>

<label>
  {label}<LabelAsterisk {required} />
  <textarea
    bind:this={textarea}
    {name}
    {placeholder}
    {required}
    {value}
    oninput={autosize}
    aria-invalid={error ? 'true' : undefined}></textarea>
  {#if error}
    <small>{error.message}</small>
  {/if}
</label>

<style>
  textarea {
    resize: none;
    min-height: calc(
      var(--pico-line-height) * var(--pico-font-size) +
        (var(--pico-border-width) + var(--pico-form-element-spacing-vertical)) * 2
    );
    max-height: 200px;
    margin-bottom: 0.5em;
  }

  small {
    color: var(--pico-form-element-invalid-active-border-color);
  }
</style>
