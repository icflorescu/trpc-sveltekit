<script lang="ts">
  import LabelAsterisk from './LabelAsterisk.svelte';

  type Props = {
    price?: boolean;
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    item: Record<string, unknown> | null;
    errors?: { message: string; path: string[] }[] | null;
  };

  let {
    price = false,
    name,
    label,
    required = false,
    placeholder = '',
    item,
    errors = null
  }: Props = $props();

  const value = $derived(item?.[name]);
  const error = $derived(errors?.find((e) => e.path.includes(name)));
</script>

<label>
  {label}<LabelAsterisk {required} />
  <input
    type={price ? 'number' : 'text'}
    step={price ? '0.01' : undefined}
    {name}
    {placeholder}
    {required}
    {value}
    aria-invalid={error ? 'true' : undefined}
  />
  {#if error}
    <small>{error.message}</small>
  {/if}
</label>

<style>
  input {
    margin-bottom: 0.5em;
  }

  small {
    color: var(--pico-form-element-invalid-active-border-color);
  }
</style>
