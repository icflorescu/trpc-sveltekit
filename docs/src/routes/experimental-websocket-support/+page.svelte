<h2>Experimental WebSocket support</h2>

<p>
  SvelteKit <a href="https://github.com/sveltejs/kit/issues/1491" target="_blank" rel="noreferrer"
    >doesn't offer WebSockets support</a
  >, but if you're using <code>@sveltejs/adapter-node</code>, <code>tRPC-SvelteKit</code> can spin up
  an experimental WS server to process tRPC procedure calls.
</p>

<p>
  If you only need subscriptions, consider streaming them over
  <a href="https://trpc.io/docs/server/subscriptions" target="_blank" rel="noreferrer"
    >server-sent events</a
  > instead, which works with every adapter.
</p>

<p>
  Please refer to the <a
    href="https://github.com/icflorescu/trpc-sveltekit#experimental-websocket-support"
    target="_blank"
    rel="noreferrer">dedicated section</a
  >
  in the README, and to the
  <a
    href="https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/websocket"
    target="_blank"
    rel="noreferrer">websocket example</a
  >, for more information.
</p>
