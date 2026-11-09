<script lang="ts">
  import { page } from '$app/state';
  import { createEventDispatcher } from 'svelte';

  export let visible = false;

  const dispatch = createEventDispatcher();

  const handleClose = () => {
    dispatch('close');
  };
</script>

<dialog open={visible}>
  <article>
    <header>
      <!-- svelte-ignore a11y_missing_content -->
      <a href="#cancel" aria-label="Cancel" class="close" on:click={handleClose}></a>
      Unauthorized!
    </header>
    <p>You need to login before trying to perform this action.</p>
    <footer>
      <button class="secondary" on:click={handleClose}>Cancel</button>
      <a
        role="button"
        class="primary"
        on:click={handleClose}
        href={`/login?returnTo=${page.url.pathname}`}>Login</a
      >
    </footer>
  </article>
</dialog>
