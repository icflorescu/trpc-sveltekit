import { MaybePromise } from '@sveltejs/kit/types/helper';
import type {
  AnyRouter,
  inferRouterContext,
  inferRouterError,
  ProcedureType,
  ResponseMeta,
  TRPCError,
} from '@trpc/server';
import type { TRPCResponse } from '@trpc/server/dist/declarations/src/rpc';

export type CreateContextFn<TRouter extends AnyRouter> = (req: Request) => MaybePromise<inferRouterContext<TRouter>>;

export type ResponseMetaFn<TRouter extends AnyRouter> = (opts: {
  data: TRPCResponse<unknown, inferRouterError<TRouter>>[];
  ctx?: inferRouterContext<TRouter>;
  paths?: string[];
  type: ProcedureType | 'unknown';
  errors: TRPCError[];
}) => ResponseMeta;
