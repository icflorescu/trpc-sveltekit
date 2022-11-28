<script lang="ts">
  import { AUTHOR_URL, BADGE_COLOR_CODE, REPO_URL } from '$lib/constants';
</script>

<footer>
  <a class="image-link" href="{REPO_URL}/blob/main/LICENSE">
    <img
      src="https://img.shields.io/github/license/icflorescu/trpc-sveltekit?style=flat&color={BADGE_COLOR_CODE}"
      alt="MIT License"
    />
  </a>
  <div class="authors">
    Built by <a class="text-link" href={AUTHOR_URL} target="_blank" rel="noreferrer"
      >Ionut-Cristian Florescu</a
    >
    and
    <a class="text-link" href="{REPO_URL}/graphs/contributors" target="_blank" rel="noreferrer"
      >these awesome people</a
    >.
  </div>
  <div class="repo-metrics">
    <!-- svelte-ignore security-anchor-rel-noreferrer -->
    <a class="image-link" href={REPO_URL} target="_blank">
      <img
        src="https://img.shields.io/github/stars/icflorescu/trpc-sveltekit?style=flat&color={BADGE_COLOR_CODE}"
        alt="GitHub Stars"
      />
    </a>
    <!-- svelte-ignore security-anchor-rel-noreferrer -->
    <a class="image-link" href="https://www.npmjs.com/package/trpc-sveltekit" target="_blank">
      <img
        src="https://img.shields.io/npm/dm/trpc-sveltekit.svg?style=flat&color={BADGE_COLOR_CODE}"
        alt="NPM Downloads"
      />
    </a>
  </div>
</footer>

<style lang="scss">
  footer {
    z-index: -1;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--footer-height);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacing) / 2);
    padding: var(--spacing);
    @media (min-width: 1024px) {
      margin-left: var(--navbar-width);
    }
    @media (min-width: 1280px) {
      padding: var(--spacing) calc(var(--spacing) * 2);
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .authors {
    font-size: 0.9em;
    text-align: center;
    margin-top: -0.2em;
    @media (min-width: 1280px) {
      font-size: 1em;
    }
    @media (min-width: 1280px) {
      margin-top: 0;
    }
  }

  .image-link {
    font-size: 0;
  }

  .text-link {
    white-space: nowrap;
  }

  .repo-metrics {
    display: flex;
    gap: calc(var(--spacing) / 2);
  }
</style>
