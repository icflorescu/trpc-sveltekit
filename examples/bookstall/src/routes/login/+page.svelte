<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto, refreshAll } from '$app/navigation';
  import { page } from '$app/state';

  let { form } = $props();

  let error = $state(false);
  let emailInput: HTMLInputElement | undefined = $state();
  let passwordInput: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (form?.success) {
      refreshAll().then(() => goto(page.url.searchParams.get('returnTo') || '/'));
    } else if (form?.error) {
      error = true;
    }
  });

  const autofill = (user: 'john' | 'jane') => (e: MouseEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    emailInput.value = `${user}@mail.com`;
    passwordInput.value = user === 'john' ? '1234' : 'qwer';
  };

  const clearError = () => {
    error = false;
  };
</script>

<svelte:head>
  <title>Login • Bookstall</title>
</svelte:head>

<form method="POST" use:enhance>
  <article>
    <header>Login</header>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label>Autofill</label>
    <div class="grid">
      <button class="secondary" onclick={autofill('john')}>John</button>
      <button class="secondary" onclick={autofill('jane')}>Jane</button>
    </div>
    <label>
      Email
      <input name="email" type="email" required bind:this={emailInput} />
    </label>
    <label>
      Password
      <input name="password" type="password" required bind:this={passwordInput} />
    </label>
    <footer>
      {#if page.url.searchParams.get('returnTo')}
        <a role="button" class="secondary" href={page.url.searchParams.get('returnTo')}>Cancel</a>
      {/if}
      <button type="submit">Login</button>
    </footer>
  </article>
</form>

<dialog open={!!error}>
  <article>
    <header>Authentication failed!</header>
    <p>Please check your credentials and try again.</p>
    <footer>
      <button class="secondary" onclick={clearError}>Ok</button>
    </footer>
  </article>
</dialog>

<style>
  form {
    max-width: 500px;
    margin: var(--block-spacing-vertical) auto;
  }
</style>
