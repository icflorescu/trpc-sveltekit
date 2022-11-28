<script lang="ts">
  import { AUTHOR_URL, BADGE_COLOR_CODE } from '$lib/constants';
</script>

<h2>Hire the author</h2>

<h3>Hi there!</h3>

<a href={AUTHOR_URL} target="_blank" rel="noreferrer"
  ><img class="author" src="https://avatars.githubusercontent.com/u/581999" alt="@icflorescu" /></a
>

<p>
  I'm Ionut-Cristian Florescu, a full-stack developer from Bucharest, Romania, EU, with more than 20
  years of experience in building commercial web applications and open-source projects.
  <br />
  tRPC-SvelteKit is one of my dearest open-source projects.
</p>

<p>
  You can learn more about what I do by visiting my profiles on <a
    href={AUTHOR_URL}
    target="_blank"
    rel="noreferrer">GitHub</a
  >
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer"
    ><img
      class="badge"
      src="https://img.shields.io/github/stars/icflorescu?style=flat&color={BADGE_COLOR_CODE}"
      alt="GitHub stars"
    /></a
  >
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer"
    ><img
      class="badge"
      src="https://img.shields.io/github/followers/icflorescu?style=flat&color={BADGE_COLOR_CODE}"
      alt="GitHub followers"
    /></a
  >
  or <a href="https://www.linkedin.com/in/icflorescu" target="_blank" rel="noreferrer">LinkedIn</a>,
  but since you are on this page, you probably have a pretty good idea of how my skills could help
  you.
</p>

<p>
  So, if you want to hire my services, don't hesitate to drop me a line at the email address listed
  in my GitHub profile. I'm currently getting a constant flow of approaches from recruiters, some of
  them relevant, others not so relevant. Mentioning "tRPC-SvelteKit" in your text would help me
  prioritize your message.
</p>

<p>
  Thank you for your interest,
  <br />
  <a href={AUTHOR_URL} target="_blank" rel="noreferrer">Ionut-Cristian Florescu</a>
</p>

<style lang="scss">
  h3 {
    margin-bottom: 0.75em;
  }

  .author {
    border-radius: var(--border-radius);
    margin-bottom: 1.5em;
    @media (min-width: 400px) {
      float: left;
      width: 30%;
      max-width: 200px;
      margin: 0.4em 1.5em 0 0;
    }
  }

  .badge {
    margin-top: -0.25em;
  }
</style>
