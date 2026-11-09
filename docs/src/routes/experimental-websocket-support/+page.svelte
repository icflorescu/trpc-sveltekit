<script lang="ts">
  import { resolve } from '$app/paths';
  import Highlight from '#lib/components/Highlight.svelte';
  import Info from '#lib/components/Info.svelte';
  import { REPO_URL } from '#lib/constants.ts';

  let { data } = $props();
</script>

<h2>Experimental WebSocket support</h2>

<p>
  SvelteKit <a href="https://github.com/sveltejs/kit/issues/1491" target="_blank" rel="noreferrer"
    >doesn't offer WebSockets support</a
  >, but if you're using <code>@sveltejs/adapter-node</code>, <code>tRPC-SvelteKit</code> can spin
  up an experimental WebSocket server to process tRPC procedure calls (support courtesy of
  <a href="https://github.com/SrZorro" target="_blank" rel="noreferrer">SrZorro</a>).
</p>

<Info>
  If you only need subscriptions, consider streaming them over
  <a href={resolve('/recipes-and-caveats')}>server-sent events</a> instead, which work with every adapter.
</Info>

<h3>Caveats</h3>

<ul>
  <li>
    Works with <a
      href="https://www.npmjs.com/package/@sveltejs/adapter-node"
      target="_blank"
      rel="noreferrer">@sveltejs/adapter-node</a
    > exclusively.
  </li>
  <li>
    All tRPC procedures are handled by the WebSocket server, unless you build your own client with a
    <a href="https://trpc.io/docs/client/links/splitLink" target="_blank" rel="noreferrer"
      ><code>splitLink</code></a
    >.
  </li>
  <li>No WebSocket server is created when building or prerendering.</li>
</ul>

<h3>Setup</h3>

<p>Install the package and its dependencies:</p>

<Highlight
  tabs={[
    {
      code: `pnpm add trpc-sveltekit @trpc/server @trpc/client ws\npnpm add -D @sveltejs/adapter-node`,
      language: 'shell',
      title: 'pnpm'
    },
    {
      code: `npm i trpc-sveltekit @trpc/server @trpc/client ws\nnpm i -D @sveltejs/adapter-node`,
      language: 'shell',
      title: 'npm'
    }
  ]}
/>

<p>
  Add the Vite plugin, which handles WebSocket connections in development and preview. It uses the
  <code>/trpc</code> path; use <code>trpcWebSocketPlugin(&#123; path &#125;)</code> for a different one.
</p>

<Highlight {...data.codeBlocks['websocket/vite.config.ts']} />

<p>
  Create the production server entry point next to <code>package.json</code>, and use it to start
  your app (e.g. <code>"start": "node ./wsServer.js"</code>). <code>SvelteKitTRPCWSServer</code>
  also accepts a second argument: <code>&#123; path, buildDir &#125;</code>.
</p>

<Highlight {...data.codeBlocks['websocket/wsServer.js']} />

<p>
  Attach your router to the WebSocket server in your server hooks. Since no WebSocket server exists
  while building, guard the call with <code>building</code>:
</p>

<Highlight {...data.codeBlocks['websocket/src/hooks.server.ts']} />

<p>The context receives the WebSocket connection options instead of a SvelteKit request event:</p>

<Highlight {...data.codeBlocks['websocket/src/lib/trpc/context.ts']} />

<h3>Usage</h3>

<p>Define your router as usual; subscriptions can be written as async generators:</p>

<Highlight {...data.codeBlocks['websocket/src/lib/trpc/router.ts']} />

<p>
  Create the client with <code>createTRPCWebSocketClient</code>, which also accepts the
  <code>wsLink</code> and <code>createWSClient</code> options (<code>transformer</code>,
  <code>retryDelayMs</code>, <code>lazy</code>, …) and a <code>url</code> path:
</p>

<Highlight {...data.codeBlocks['websocket/src/lib/trpc/client.ts']} />

<p>Then call your procedures and subscribe to subscriptions in your pages:</p>

<Highlight {...data.codeBlocks['websocket/src/routes/messages/+page.svelte']} />

<h3>How it works</h3>

<ul>
  <li>
    The Vite plugin creates a <code>WebSocketServer</code> (with <code>noServer: true</code>, so it
    doesn't interfere with Vite's own HMR WebSocket) and upgrades the requests made to the tRPC
    path.
  </li>
  <li>
    The server is stored in <code>globalThis[Symbol.for('trpc.sveltekit.wss')]</code>, so it can be
    reached from your SvelteKit server hooks.
  </li>
  <li>
    In production, <code>SvelteKitTRPCWSServer</code> imports the <code>adapter-node</code> build output
    and attaches the same upgrade handler to its HTTP server.
  </li>
  <li>
    In the browser, <code>trpc-sveltekit/websocket</code> resolves to a client-only entry point, so no
    server code ends up in your bundle.
  </li>
</ul>

<p>
  See the complete
  <a href="{REPO_URL}/tree/main/examples/websocket" target="_blank" rel="noreferrer"
    >websocket example</a
  > in the repository.
</p>
