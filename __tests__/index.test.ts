import * as trpc from '@trpc/server';
import { createTRPCHandle } from '../src';

const router = trpc.router();

test("Should throw when url doesn't starts with `/`", () => {
  expect(() => {
    createTRPCHandle({ url: 'trpc', router });
  }).toThrowError();
});

test('Should throw when url ends with `/`', () => {
  expect(() => {
    createTRPCHandle({ url: '/trpc/', router });
  }).toThrowError();
});
