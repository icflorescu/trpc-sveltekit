<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import HeaderNavLink from './HeaderNavLink.svelte';

  export let isAuthenticated: boolean;

  const logout = async () => {
    await fetch('/logout', { method: 'POST' });
    invalidateAll();
  };
</script>

<header>
  <a class="title-link" href="/">
    <h1>Bookstall</h1>
    <p>Fantasy novels</p>
  </a>
  <hr />
  <nav>
    <ul>
      <HeaderNavLink to="/authors" title="Authors" />
      <HeaderNavLink to="/books" title="Books" />
      <HeaderNavLink to="/stores" title="Stores" />
      {#if isAuthenticated}
        <HeaderNavLink on:click={logout} title="Logout" />
      {:else}
        <HeaderNavLink to="/login" title="Login" />
      {/if}
    </ul>
  </nav>
</header>

<style lang="scss">
  header {
    background: var(--card-background-color);
    border-bottom: 1px solid var(--muted-border-color);
    padding: 1em 1em 0;
    text-align: center;
    text-transform: uppercase;
  }

  .title-link {
    display: inline-block;
    text-decoration: none;
  }

  h1,
  p {
    color: var(--h6-color);
    font-family: Cormorant, serif;
    line-height: 1;
    margin: 0;
  }

  h1 {
    font-size: 3em;
  }

  p {
    font-size: 0.75em;
    letter-spacing: 1.1em;
    text-indent: 0.9em;
  }

  hr {
    width: 5em;
    margin: 1em auto -0.4em;
  }

  nav {
    justify-content: center;
  }
</style>
