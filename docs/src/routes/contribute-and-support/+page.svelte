<script lang="ts">
  import { base } from '$app/paths';
  import Info from '$lib/components/Info.svelte';
  import { AUTHOR_URL, REPO_URL } from '$lib/constants';
  import { useMediaQuery } from '$lib/useMediaQuery';

  let md = useMediaQuery('(min-width: 1024px)');
  let lg = useMediaQuery('(min-width: 1280px)');
</script>

<h2>Contribute and support</h2>

<p>
  Although I'm <a href={AUTHOR_URL} target="_blank" rel="noreferrer">mainly a React developer</a>,
  I've dedicated a sizeable amount of my own free time to build this project because:
</p>
<ul>
  <li>
    I found Svelte refreshing and exciting (was simply astonished by how easy one can achieve things
    with far fewer lines of code than with React), but was a bit put-off by the (yet-) lack of tools
    in its ecosystem;
  </li>
  <li>
    I'm a keen advocate of open-source and <a
      href="https://medium.com/@icflorescu/open-source-capitalism-and-democracy-c71f025b6eba"
      target="_blank"
      rel="noreferrer">I believe in its power to make our world a better place</a
    >.
  </li>
</ul>

<h3>Raising issues and asking for features</h3>

<p>
  <!-- svelte-ignore security-anchor-rel-noreferrer -->
  If you find a bug, please don't hesitate to
  <a href="{REPO_URL}/issues" target="_blank">raise an issue</a>.
  <br />
  If you have an idea about a new or missing feature, let's
  <!-- svelte-ignore security-anchor-rel-noreferrer -->
  <a href="{REPO_URL}/discussions" target="_blank">discuss it here</a>.
</p>

<Info>
  Be considerate when asking for a new feature!
  <br />
  Is it really something that would be useful for other people, or just a singular edge case?
</Info>

<h3>Contributing</h3>

<p>
  Better yet, if you're willing to put your effort into it, coming up with a pull-request would be
  fantastic. So many people <em>take open-source for granted</em>, but far fewer understand its true
  essence and are generous enough to contribute their own time and skills to a project they find
  useful.
</p>

<Info>
  If you want to implement a new feature or improve an existing one, make sure to also add an
  example and/or alter the one(s) already referring to it.
  <br />
  It's not a feature if other people don't know about it or don't understand how to use it.
  <br />
  Also, make sure your new feature doesn't break existing ones.
</Info>

<h3>List of code contributors</h3>

<a href="{REPO_URL}/graphs/contributors">
  <img
    src="https://contrib.rocks/image?repo=icflorescu/trpc-sveltekit&columns={$lg
      ? '12'
      : $md
      ? '8'
      : '4'}"
    alt="tRPC-SvelteKit contributors"
  />
</a>

<h3>Supporting the project</h3>

<p>
  <!-- svelte-ignore security-anchor-rel-noreferrer -->
  If you find this project useful, it would help a lot if you could 🙏<a
    href={REPO_URL}
    target="_blank">star the repository</a
  >, 💕<a
    href="https://twitter.com/share?text=Use%20tRPC%20in%20your%20SvelteKit%20applications&url=https%3A%2F%2Fgithub.com%2Ficflorescu%2Ftrpc-sveltekit&hashtags=trpc%2Csveltekit%2Csvelte%2Ctypescript&via=icflorescu"
    target="_blank"
    rel="noreferrer">spread the word</a
  >, 👍<a href="https://www.linkedin.com/in/icflorescu" target="_blank" rel="noreferrer"
    >endorse me on LinkedIn</a
  >, 💗<a href="https://github.com/sponsors/icflorescu" target="_blank" rel="noreferrer"
    >sponsor this project</a
  >, or — better yet — <a href="{base}/hire-the-author">hire my services</a>.
</p>

<h3>Sponsoring the project</h3>

<p>
  Writing and maintaining open-source code requires a lot of time, effort and energy. Your
  sponsorship 💗<a href="https://github.com/sponsors/icflorescu" target="_blank" rel="noreferrer"
    >would help a lot</a
  >!
</p>

<h3>Why do repository stars matter</h3>

<p>
  The more stars this repository gets, the more visibility it gains among the Svelte users
  community. The more users it gets, the more chances that some of those users will become active
  code contributors willing to put their effort into bringing new features to life and/or fixing
  bugs.
  <br />
  As the repository gain awareness, my chances of getting hired to work on Svelte-based projects will
  increase, which in turn will help maintain my vested interest in keeping the project alive.
</p>

<p>
  Thank you for your support,
  <br />
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer">Ionut-Cristian Florescu</a>
</p>
