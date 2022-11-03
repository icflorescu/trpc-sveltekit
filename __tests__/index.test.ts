import { Handle, RequestEvent } from '@sveltejs/kit';
import { initTRPC } from '@trpc/server';
import { createTRPCHandle } from '../src';

const t = initTRPC.create();
const router = t.router({});
const event: RequestEvent = {} as unknown as RequestEvent;
const resolve: Parameters<Handle>[0]['resolve'] =
  {} as unknown as Parameters<Handle>[0]['resolve'];

test("Should throw when url doesn't starts with `/`", () => {
  return expect(
    createTRPCHandle({ url: 'trpc', router, event, resolve })
  ).rejects.toThrow();
});

test('Should throw when url ends with `/`', () => {
  return expect(
    createTRPCHandle({ url: '/trpc/', router, event, resolve })
  ).rejects.toThrow();
});
