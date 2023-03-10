<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import { onMount } from 'svelte';

  const client = trpc();

  let messages: string[] = [];

  onMount(() => {
    client.allMessages.subscribe(undefined, {
      onData(newMessage) {
        messages.push(newMessage);
        messages = messages;
      }
    });
  });

  let el: HTMLElement;

  $: {
    if (el) el.scrollIntoView();
  }
</script>

<div class="container">
  <h1>✨ WebSocket Messages ✨</h1>
  <div class="messages">
    {#each messages as message, i}
      {#if i === messages.length - 1}
        <h2 bind:this={el}>{message}</h2>
      {:else}
        <h2>{message}</h2>
      {/if}
    {/each}
  </div>
</div>

<style>
  h2 {
    margin-block: 0.5rem !important;
  }

  .container {
    width: 100%;
    height: 100%;
    padding: 6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }

  .messages {
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
  }
</style>
