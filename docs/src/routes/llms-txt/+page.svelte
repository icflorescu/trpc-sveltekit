<script lang="ts">
  import { resolve } from '$app/paths';
  import Highlight from '#lib/components/Highlight.svelte';
  import Info from '#lib/components/Info.svelte';
  import { GITHUB_PAGES_ROOT } from '#lib/constants.ts';

  let { data } = $props();
</script>

<h2>LLMs.txt</h2>

<p>
  If you're using AI assistants or coding agents (such as Claude, ChatGPT, Cursor or GitHub Copilot)
  to build your application, you can point them to the <code>tRPC-SvelteKit</code>
  documentation in a format they can easily read, following the
  <a href="https://llmstxt.org" target="_blank" rel="noreferrer">LLMs.txt standard</a>.
</p>

<p>Two files are generated from this website's content every time it's published:</p>

<ul>
  <li>
    <a href={resolve('/llms.txt')} target="_blank"><code>llms.txt</code></a> - a concise overview:
    the most important facts about using <code>tRPC-SvelteKit</code>, followed by links to every
    documentation page and example app;
  </li>
  <li>
    <a href={resolve('/llms-full.txt')} target="_blank"><code>llms-full.txt</code></a> - the complete
    documentation in a single file, including all the code examples shown on this website.
  </li>
</ul>

<h3>How to use them</h3>

<ul>
  <li>
    Paste <code>{GITHUB_PAGES_ROOT}/llms-full.txt</code> in a chat with your AI assistant and ask it to
    read the file before answering your questions;
  </li>
  <li>
    Add <code>{GITHUB_PAGES_ROOT}/llms.txt</code> as a documentation source in your AI-powered
    editor (for instance, with the <code>@Docs</code> feature in Cursor);
  </li>
  <li>
    Tell your coding agent to fetch <code>{GITHUB_PAGES_ROOT}/llms-full.txt</code>, or download the
    file and reference it from your project's agent instructions (<code>CLAUDE.md</code>,
    <code>AGENTS.md</code>, <code>.cursor/rules</code> etc.).
  </li>
</ul>

<Info>
  Use <code>llms-full.txt</code> when your tool can handle a larger context and you want the most
  accurate answers; use <code>llms.txt</code> when your tool can follow links and fetch only the pages
  it needs.
</Info>

<h3>What's inside llms.txt</h3>

<Highlight code={data.llmsTxt} language="markdown" title="llms.txt" />
