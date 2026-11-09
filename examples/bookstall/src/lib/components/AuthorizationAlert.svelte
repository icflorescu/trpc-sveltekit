<script lang="ts">
  import { page } from '$app/state';

  let { visible = false, onclose }: { visible?: boolean; onclose?: () => void } = $props();
</script>

<dialog open={visible}>
  <article>
    <header>
      <!-- svelte-ignore a11y_missing_content -->
      <a href="#cancel" aria-label="Cancel" class="close" onclick={onclose}></a>
      Unauthorized!
    </header>
    <p>You need to login before trying to perform this action.</p>
    <footer>
      <button class="secondary" onclick={onclose}>Cancel</button>
      <a
        role="button"
        class="primary"
        onclick={onclose}
        href={`/login?returnTo=${page.url.pathname}`}>Login</a
      >
    </footer>
  </article>
</dialog>
