<script lang="ts">
  import LogoNetlify from './LogoNetlify.svelte';
  import LogoNode from './LogoNode.svelte';
  import LogoVercel from './LogoVercel.svelte';
  import SupportedAdapter from './SupportedAdapter.svelte';
</script>

<div class="root">
  <h3>tRPC-SvelteKit works with:</h3>
  <div class="list">
    <SupportedAdapter name="node"><LogoNode height="1.5em" /></SupportedAdapter>
    <SupportedAdapter name="vercel"><LogoVercel height="1.5em" /></SupportedAdapter>
    <SupportedAdapter name="netlify"><LogoNetlify height="1.5em" /></SupportedAdapter>
  </div>
</div>

<style lang="scss">
  .root {
    @media (min-width: 768px) {
      text-align: center;
    }
  }

  h3 {
    font-size: 1.25em;
    font-weight: normal;
    margin: 2em 0;
    color: var(--muted-color);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 1em;
    @media (min-width: 768px) {
      display: inline-flex;
      flex-direction: row;
    }
  }
</style>
