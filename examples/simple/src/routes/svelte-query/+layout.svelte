<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';

  let { data, children } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
  {@render children()}
</QueryClientProvider>
