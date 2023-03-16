<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

  let message = '';

  const client = trpc();
  const addMessage = async () => {
    await client.addMessage.mutate(message);
    message = '';
  };
</script>

<h1>WebSocket example</h1>
<p>
  Open <a href={`${$page.url}messages`} target="_blank">{$page.url}messages</a> in a new window/tab.
</p>

<form class="add-message" on:submit|preventDefault={addMessage}>
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
