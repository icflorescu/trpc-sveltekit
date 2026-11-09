<script lang="ts">
  import { AUTHOR_URL, REPO_URL } from '#lib/constants.ts';
</script>

<h2>Acknowledgements</h2>

<h3>Alex / KATT and tRPC</h3>

<div class="intro">
  <a class="avatar" href="https://github.com/KATT" target="_blank" rel="noreferrer"
    ><img src="https://github.com/KATT.png" alt="Alex / KATT" /></a
  >
  <div>
    <p>
      tRPC-SvelteKit is built on the shoulders of
      <a href="https://trpc.io/" target="_blank" rel="noreferrer">tRPC</a>, and tRPC wouldn't be
      what it is without
      <a href="https://github.com/KATT" target="_blank" rel="noreferrer">Alex / KATT</a>, its
      creator, a developer from Malmö, Sweden, who has been coding for more than 20 years. He is by
      far the project's most active contributor, with over 2,000 commits.
    </p>
    <p>
      tRPC has had a tremendous impact on the TypeScript ecosystem. Its idea is beautifully simple:
      write a function on the server and call it from the client, fully typed end to end, without
      schemas to maintain or code to generate. Today it has over 40,000 stars on GitHub and its
      server package is downloaded around 8 million times a week, with adapters for most popular
      frameworks.
    </p>
  </div>
</div>

<p>
  Alex was the very first sponsor of this project 🎉, and his encouragement meant a lot. He has also
  been remarkably generous with his time: when tRPC's HTTP resolver was rewritten on top of the
  Fetch API ahead of v11, he
  <a href="{REPO_URL}/issues/122" target="_blank" rel="noreferrer">reached out personally</a>
  to let me know and to offer his help.
</p>

<p>
  I'm proud that tRPC-SvelteKit is part of the tRPC ecosystem: it's listed among the
  <a href="https://trpc.io/docs/community/awesome-trpc" target="_blank" rel="noreferrer"
    >community projects</a
  >
  in the tRPC documentation, and the
  <a href="https://trpc.io/blog/announcing-trpc-10" target="_blank" rel="noreferrer"
    >tRPC v10 announcement</a
  > linked to it as the community adapter for Svelte, next to the ones for Solid and Vue. Thank you, Alex,
  and thanks to everyone on the tRPC team and its community!
</p>

<h3>Contributors</h3>

<p>
  Thanks to everyone who has contributed to tRPC-SvelteKit, including
  <a href="https://github.com/SrZorro" target="_blank" rel="noreferrer">SrZorro</a> for the
  WebSocket support, and to everyone who opened issues and pull requests. You can see all the
  <a href="{REPO_URL}/graphs/contributors?all=1" target="_blank" rel="noreferrer">contributors</a>
  on GitHub.
</p>

<p>
  Thank you for your support,
  <br />
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer">Ionut-Cristian Florescu</a>
</p>

<style lang="scss">
  .intro {
    display: grid;
    gap: calc(var(--pico-spacing) * 1.5);
    align-items: center;
    margin-bottom: var(--pico-spacing);
    @media (min-width: 576px) {
      grid-template-columns: 140px 1fr;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }

  .avatar {
    width: 140px;
    img {
      display: block;
      border-radius: var(--pico-border-radius);
    }
  }
</style>
