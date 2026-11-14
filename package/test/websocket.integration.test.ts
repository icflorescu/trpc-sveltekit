import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo, Socket } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';
import { initTRPC } from '@trpc/server';
import { afterEach, describe, expect, it } from 'vitest';
import {
  closeWSSGlobalInstance,
  createTRPCWebSocketServer,
  createUpgradeHandler,
  createWSSGlobalInstance,
  getWSSGlobalInstance,
  GlobalThisWSS,
  SvelteKitTRPCWSServer
} from '../src/websocket/index.js';

/*
 * Integration tests for `trpc-sveltekit/websocket`, with a real HTTP server and tRPC WebSocket clients.
 * They're slower than the unit tests, so they're not part of `pnpm test` (nor CI): run them locally
 * with `pnpm test:integration`.
 */

const t = initTRPC.create();

const router = t.router({
  hello: t.procedure.input((v) => v as string).query(({ input }) => `Hello ${input}`),
  ticks: t.procedure.subscription(async function* () {
    yield 1;
    yield 2;
  })
});

type Router = typeof router;

const cleanups: (() => unknown)[] = [];

afterEach(async () => {
  try {
    for (const cleanup of cleanups.splice(0).reverse()) await cleanup();
  } finally {
    delete (globalThis as Record<symbol, unknown>)[GlobalThisWSS];
  }
});

/** Start an HTTP server, as the Vite plugin or adapter-node would, on a random port */
async function startServer(server: Server = createServer()) {
  // `closeAllConnections()` doesn't close upgraded sockets, so track them all
  const sockets = new Set<Socket>();
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  cleanups.push(() => {
    for (const socket of sockets) socket.destroy();
    return new Promise((resolve) => server.close(resolve));
  });
  return { server, port: (server.address() as AddressInfo).port };
}

function createClient(port: number, path = '/trpc') {
  const closeCodes: number[] = [];
  const wsClient = createWSClient({
    url: `ws://127.0.0.1:${port}${path}`,
    retryDelayMs: () => 50,
    onClose: (cause) => closeCodes.push(cause?.code ?? 0)
  });
  cleanups.push(() => wsClient.close());
  const client = createTRPCClient<Router>({ links: [wsLink({ client: wsClient })] });
  return { client, wsClient, closeCodes };
}

const collectTicks = (client: ReturnType<typeof createClient>['client']) =>
  new Promise<number[]>((resolve, reject) => {
    const values: number[] = [];
    const sub = client.ticks.subscribe(undefined, {
      onData: (value) => values.push(value),
      onComplete: () => resolve(values),
      onError: reject
    });
    cleanups.push(() => sub.unsubscribe());
  });

/** Attempt a raw WebSocket upgrade and report the HTTP status of the response */
function upgradeStatus(port: number, path: string) {
  return new Promise<number>((resolve) => {
    const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
    ws.onopen = () => {
      ws.close();
      resolve(101);
    };
    ws.onerror = () => resolve(0);
  });
}

describe('trpc-sveltekit/websocket (integration)', () => {
  it('handles queries and subscriptions over a WebSocket', async () => {
    createWSSGlobalInstance();
    const { server, port } = await startServer();
    server.on('upgrade', createUpgradeHandler());
    createTRPCWebSocketServer({ router });

    const { client } = createClient(port);
    expect(await client.hello.query('world')).toBe('Hello world');
    expect(await collectTicks(client)).toEqual([1, 2]);
  });

  it('only handles upgrade requests made to the tRPC path', async () => {
    createWSSGlobalInstance();
    const { server, port } = await startServer();
    server.on('upgrade', createUpgradeHandler('/custom'));
    // stands in for Vite's HMR WebSocket, which must be left alone
    const otherUpgrades: string[] = [];
    server.on('upgrade', (req) => otherUpgrades.push(req.url ?? ''));
    createTRPCWebSocketServer({ router });

    const { client } = createClient(port, '/custom');
    expect(await client.hello.query('custom path')).toBe('Hello custom path');
    expect(otherUpgrades).toEqual(['/custom']);
    // requests to other paths aren't answered by the tRPC handler
    const other = new WebSocket(`ws://127.0.0.1:${port}/other`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(other.readyState).toBe(WebSocket.CONNECTING);
    other.close();
  });

  it('rejects connections until a router is attached, then lets clients reconnect', async () => {
    createWSSGlobalInstance();
    const { server, port } = await startServer();
    server.on('upgrade', createUpgradeHandler());

    // like in development, before SvelteKit loads the server hooks
    expect(await upgradeStatus(port, '/trpc')).toBe(0);

    const { client } = createClient(port);
    const result = client.hello.query('later');
    await new Promise((resolve) => setTimeout(resolve, 200));
    createTRPCWebSocketServer({ router });
    expect(await result).toBe('Hello later');
  });

  it('closes connections so that the HTTP server can shut down', async () => {
    createWSSGlobalInstance();
    const server = createServer();
    const { port } = await startServer(server);
    server.on('upgrade', createUpgradeHandler());
    createTRPCWebSocketServer({ router });

    const { client, closeCodes } = createClient(port);
    expect(await client.hello.query('before')).toBe('Hello before');

    const closed = new Promise<void>((resolve) => server.close(() => resolve()));
    closeWSSGlobalInstance();
    await closed;

    expect(closeCodes).toContain(1001);
    // new connections are refused while shutting down
    expect(await upgradeStatus(port, '/trpc')).toBe(0);
  });

  it('starts an adapter-node build with WebSocket support and shuts down on SIGTERM', async () => {
    // a stand-in for the adapter-node build output, which exports its HTTP server
    const dir = await mkdtemp(join(tmpdir(), 'trpc-sveltekit-'));
    cleanups.push(() => rm(dir, { recursive: true, force: true }));
    const { server, port } = await startServer();
    const key = `__trpcSvelteKitTestServer${Date.now()}`;
    (globalThis as Record<string, unknown>)[key] = server;
    cleanups.push(() => delete (globalThis as Record<string, unknown>)[key]);
    await writeFile(join(dir, 'build.js'), `export const server = globalThis.${key};\n`);
    await writeFile(join(dir, 'index.js'), `export * from './build.js';\n`);

    const signals = ['SIGTERM', 'SIGINT'] as const;
    const before = signals.map((signal) => process.listeners(signal));
    await SvelteKitTRPCWSServer(pathToFileURL(join(dir, 'wsServer.js')).href, { buildDir: '.' });
    const [shutdown, shutdownOnInterrupt] = signals.map((signal, i) =>
      process.listeners(signal).find((listener) => !before[i].includes(listener))
    );
    expect(shutdown).toBeTypeOf('function');
    expect(shutdownOnInterrupt).toBeTypeOf('function');
    cleanups.push(() => {
      process.off('SIGTERM', shutdown!);
      process.off('SIGINT', shutdownOnInterrupt!);
    });

    expect(getWSSGlobalInstance()).toBeDefined();
    createTRPCWebSocketServer({ router });
    const { client, closeCodes } = createClient(port);
    expect(await client.hello.query('production')).toBe('Hello production');

    // what adapter-node does on SIGTERM, plus our own listener
    const closed = new Promise<void>((resolve) => server.close(() => resolve()));
    (shutdown as () => void)();
    await closed;
    expect(closeCodes).toContain(1001);
  });
});
