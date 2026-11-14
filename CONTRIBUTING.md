# Contributing

Pull requests are welcome.

This is a [pnpm](https://pnpm.io) workspace containing the library (`package`), the documentation site (`docs`) and the example apps (`examples/*`). You'll need Node.js 22.17 or newer.

```sh
pnpm install
pnpm dev     # builds the library, then runs it in watch mode alongside the docs and examples
pnpm test    # runs the library tests
pnpm test:integration  # runs the WebSocket integration tests (slower; local only, not run in CI)
pnpm check   # type-checks everything
pnpm lint    # Prettier + Oxlint
pnpm format  # fixes formatting and lint issues where possible
```

Before opening a pull request, please make sure `pnpm lint`, `pnpm check` and `pnpm test` pass (and `pnpm test:integration`, if you've changed the WebSocket support). If you're adding a feature, please update the documentation as well.

## Releasing

1. Bump the version in `package/package.json` (use a prerelease version such as `4.1.0-next.0` to publish to the `next` tag) and merge to `main`.
2. The _Publish npm & deploy docs_ workflow stages the release on npm.
3. Approve it with `npm stage list trpc-sveltekit` and `npm stage approve <id>` (requires 2FA).
