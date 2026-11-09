<h2>Upgrading to v4</h2>

<p>
  <code>trpc-sveltekit</code> v4 targets tRPC v11 and works with SvelteKit 2 and 3. The API is mostly
  unchanged, so upgrading is usually a matter of updating your dependencies:
</p>

<ul>
  <li>
    Upgrade <code>@trpc/server</code> and <code>@trpc/client</code> to v11 and follow the
    <a href="https://trpc.io/docs/migrate-from-v10-to-v11" target="_blank" rel="noreferrer"
      >tRPC v11 migration guide</a
    >.
  </li>
  <li>
    <code>createTRPCClient</code> still accepts a <code>transformer</code>, and forwards it to its
    default link. If you pass your own <code>links</code>, set the transformer on them instead.
  </li>
  <li>
    <code>createTRPCClient</code> now forwards every <code>httpBatchLink</code> option, such as
    <code>maxURLLength</code> or <code>methodOverride</code>.
  </li>
  <li>
    <code>createTRPCHandle</code> accepts every option of tRPC's HTTP handlers.
    <code>responseMeta</code> and <code>onError</code> use the tRPC v11 signatures, and
    <code>createContext</code> receives the fetch adapter options as a second argument.
  </li>
  <li>
    Responses are streamed, so <code>httpBatchStreamLink</code> and subscriptions over server-sent events
    work with every adapter.
  </li>
  <li>The handle can be used in apps with prerendered pages.</li>
  <li>
    <code>@sveltejs/adapter-node</code> is no longer a peer dependency, <code>ws</code> is only
    needed for WebSocket support, and <code>trpc-sveltekit</code> no longer depends on the
    <code>cookie</code> package.
  </li>
</ul>
