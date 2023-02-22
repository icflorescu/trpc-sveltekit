<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let message = '';
  let loading = false;

  const client = trpc();
  const addMessage = async () => {
    await client.addMessage.mutate(message);
  };

  onMount(() => {
    client.allMessages.subscribe(undefined, {
      onData(newMessage) {
        console.log(newMessage);
      }
    });
  });
</script>

<h1>Add a new message</h1>
See the messages appear at:<strong><a href={`${$page.url}messages`}>{$page.url}messages</a></strong>
<br />
<span> (preferably in a second window) </span>

<div class="add-message">
  <input type="text" bind:value={message} required min="1" />
  <a
    placeholder="Add message"
    href="#load"
    role="button"
    class="secondary"
    aria-busy={loading}
    on:click|preventDefault={addMessage}>Add Message</a
  >
</div>

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
