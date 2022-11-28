<script lang="ts">
  import { base } from '$app/paths';
  import { PAGES, REPO_URL } from '$lib/constants';
  import IconGitHub from '$lib/icons/IconGitHub.svelte';

  const gettingStartedPage = PAGES[1];
  const GettingStartedPageIcon = gettingStartedPage.icon;
</script>

<div>
  <a role="button" href="{base}{gettingStartedPage.path}">
    <GettingStartedPageIcon size="1.25em" />
    Get started
  </a>
  <!-- svelte-ignore security-anchor-rel-noreferrer -->
  <a role="button" class="secondary" href={REPO_URL} target="_blank">
    <IconGitHub size="1.25em" />
    View code
  </a>
</div>

<style lang="scss">
  div {
    margin-top: 2em;
    display: flex;
    flex-wrap: wrap;
    gap: 1.25em;
    justify-content: left;
    @media (min-width: 768px) {
      margin-top: 3em;
      justify-content: center;
    }
  }

  a {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    @media (min-width: 768px) {
      width: 25%;
    }
  }
</style>
