<script lang="ts">
  import { page } from '$app/state';
  import { trpc } from '#lib/trpc/client.ts';

  let message = $state('');

  const addMessage = async (e: SubmitEvent) => {
    e.preventDefault();
    await trpc().addMessage.mutate(message);
    message = '';
  };
</script>

<h1>WebSocket example</h1>
<p>
  Open <a href="/messages" target="_blank">{page.url.origin}/messages</a> in a new window/tab.
</p>

<form class="add-message" onsubmit={addMessage}>
  <input type="text" bind:value={message} required min="1" />
  <button> Add Message </button>
</form>

<style>
  .add-message {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
