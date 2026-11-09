type HasTrailingSlash<S extends string, IfTrue = true, IfFalse = false> = S extends `${string}/`
  ? IfTrue
  : IfFalse;

type ValidateRouteStart<S extends string, IfValid = S, IfInvalid = never> = HasTrailingSlash<
  S,
  IfInvalid,
  S extends `/${string}` ? IfValid : IfInvalid
>;

type ValidateRouteEnd<T extends string> = string & {
  __errorMsg: `${T} is not a valid route because ${HasTrailingSlash<
    T,
    'it has a trailing slash',
    'it does not start with a slash'
  >}`;
};

export type ValidRoute<T extends string> = ValidateRouteStart<T, T, ValidateRouteEnd<T>> | '/trpc';
