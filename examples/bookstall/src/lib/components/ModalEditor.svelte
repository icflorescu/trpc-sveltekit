<script lang="ts" generics="T">
  import dayjs from '#lib/dayjs.ts';
  import IconClock from '#lib/icons/IconClock.svelte';
  import type { Snippet } from 'svelte';
  import BusyOverlay from './BusyOverlay.svelte';

  type Props = {
    itemName: string;
    item:
      | (T & {
          id: string | null;
          updatedAt?: Date;
          updatedBy?: { name: string } | null;
        })
      | null;
    busy?: boolean;
    arrayFields?: string[];
    oncancel: () => void;
    onsave: (data: T) => void;
    children: Snippet;
  };

  let { itemName, item, busy = false, arrayFields, oncancel, onsave, children }: Props = $props();

  const handleCancel = (e: Event) => {
    e.preventDefault();
    oncancel();
  };

  const handleSave = (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    if (arrayFields) {
      for (const key of arrayFields) {
        data[key] = [];
      }
    }

    for (const [key, value] of formData) {
      if (arrayFields?.includes(key)) {
        (data[key] as unknown[]).push(value);
      } else {
        data[key] = value;
      }
    }
    onsave(data as T);
  };
</script>

<form onsubmit={handleSave}>
  <dialog open={!!item}>
    <input type="hidden" name="id" value={item?.id} />
    <article>
      <BusyOverlay visible={busy} />
      <header>
        <!-- svelte-ignore a11y_missing_content -->
        <a href="#cancel" aria-label="Cancel" class="close" onclick={handleCancel}></a>
        {item?.id ? 'Edit' : 'Add'}
        {itemName}
      </header>
      {@render children()}
      {#if item?.id}
        <small>
          <span class="clock-icon"><IconClock /></span>
          Last updated
          {dayjs(item.updatedAt).fromNow()}
          {item.updatedBy ? ` by ${item.updatedBy.name}` : ''}
        </small>
      {/if}
      <footer>
        <button class="secondary" onclick={handleCancel}>Cancel</button>
        <button type="submit">Save</button>
      </footer>
    </article>
  </dialog>
</form>

<style lang="scss">
  small {
    display: block;
    margin-left: 1.5em;
    text-indent: -1.5em;
    color: var(--pico-muted-color);
  }

  .clock-icon {
    vertical-align: text-bottom;
    margin-right: 0.25em;
  }
</style>
