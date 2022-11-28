<script lang="ts">
  import CallsToAction from '$lib/components/home/CallsToAction.svelte';
  import LogosBlend from '$lib/components/home/LogosBlend.svelte';
  import Mantra from '$lib/components/home/Mantra.svelte';
  import SupportedAdapters from '$lib/components/home/SupportedAdapters.svelte';
</script>

<div class="root">
  <LogosBlend />
  <Mantra />
  <SupportedAdapters />
  <CallsToAction />
</div>

<style>
  .root {
    width: fit-content;
    margin: 0 auto;
  }
</style>
