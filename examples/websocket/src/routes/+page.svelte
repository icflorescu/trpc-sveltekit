<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { page } from '$app/stores';

  let message = '';

  const client = trpc();
  const addMessage = async () => {
    await client.addMessage.mutate(message);
  };
</script>

<h1>Add a new message</h1>
See the messages appear at:<strong><a href={`${$page.url}messages`}>{$page.url}messages</a></strong>
<br />
<span> (preferably in a second window) </span>

<form class="add-message" on:submit|preventDefault={addMessage}>
  <input type="text" bind:value={message} required min="1" />
  <button> Add Message </button>
</form>

<style>
  h1 {
    margin: 0 !important;
    margin-bottom: 1rem !important;
  }

  .add-message {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
