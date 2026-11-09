# Contributing

Pull requests are welcome.

This is a [pnpm](https://pnpm.io) workspace containing the library (`package`), the documentation site (`docs`) and the example apps (`examples/*`). You'll need Node.js 22.17 or newer.

```sh
pnpm install
pnpm dev     # builds the library, then runs it in watch mode alongside the docs and examples
pnpm test    # runs the library tests
pnpm check   # type-checks everything
pnpm lint    # Prettier + Oxlint
pnpm format  # fixes formatting and lint issues where possible
```

Before opening a pull request, please make sure `pnpm lint`, `pnpm check` and `pnpm test` pass. If you're adding a feature, please update the documentation as well.
