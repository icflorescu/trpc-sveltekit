<script lang="ts">
  import { page } from '$app/state';
  import { trpc } from '#lib/trpc/client.ts';

  let greeting = $state('press the button to load data');
  let loading = $state(false);

  const loadData = async (e: MouseEvent) => {
    e.preventDefault();
    loading = true;
    greeting = await trpc(page).greeting.query();
    loading = false;
  };
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<a href="#load" role="button" class="secondary" aria-busy={loading} onclick={loadData}>Load</a>
<p>{greeting}</p>
