<script lang="ts">
  type Props = {
    name: string;
    label: string;
    item: Record<string, unknown> | null;
    options: { value: string; label: string }[];
  };

  let { name, label, item, options }: Props = $props();

  const isChecked = (value: string) =>
    ((item?.[name] as string[] | undefined) ?? []).includes(value);
</script>

<legend>{label}</legend>
<div>
  {#each options as option (option.value)}
    <label>
      <input
        type="checkbox"
        name="storeIds"
        value={option.value}
        checked={isChecked(option.value)}
      />
      {option.label}
    </label>
  {/each}
</div>

<style>
  div {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    display: flex;
    flex-wrap: wrap;
    column-gap: 1em;
    row-gap: 0.25em;
  }
</style>
