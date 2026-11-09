import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import pkg from '../package.json' with { type: 'json' };

describe('trpc-sveltekit/websocket', () => {
  it('resolves to a client-only entry in the browser', async () => {
    expect(pkg.exports['./websocket'].browser).toBe('./dist/websocket/index.browser.js');
    const browserEntry = await import('../src/websocket/index.browser.js');
    expect(Object.keys(browserEntry)).toEqual(['createTRPCWebSocketClient']);
  });

  it('does not statically import Node.js built-ins in modules shared with the browser', async () => {
    // Vite replaces Node.js built-ins with stubs that throw when named imports are accessed
    for (const file of ['client.ts', 'index.browser.ts']) {
      const source = await readFile(new URL(`../src/websocket/${file}`, import.meta.url), 'utf-8');
      expect(source).not.toMatch(/from 'node:/);
    }
  });
});
