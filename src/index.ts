import { CommonRequest, CommonResponse } from "servie/dist/common";
import { getURL } from "servie-url";
import { match, Path } from "path-to-regexp";

/**
 * Add `params` to the request object.
 */
export const params = Symbol("params");

/**
 * Valid input function type.
 */
export type Fn<T extends CommonRequest, U extends CommonResponse> = (
  req: T,
  done: () => Promise<U>
) => U | Promise<U>;

/**
 * Allowed `path-to-regexp` options.
 */
export type Options = Partial<
  Record<"end" | "start" | "strict" | "sensitive", boolean>
>;

export interface RequestParams<T extends object> {
  [params]: T;
}

/**
 * The `path` function matches request paths against `path-to-regexp`.
 */
export function path<
  T extends CommonRequest,
  U extends CommonResponse,
  P extends object = object
>(path: Path, fn: Fn<T & RequestParams<P>, U>, options?: Options) {
  const check = match<P>(path, {
    encode: encodeURI,
    decode: decodeURIComponent,
    ...options
  });

  return async function pathMiddleware(req: T, next: () => Promise<U>) {
    const { pathname } = getURL(req);
    const m = check(pathname);
    if (!m) return next();

    return fn(Object.assign(req, { [params]: m.params }), next);
  };
}

/**
 * Match requests against a method.
 */
export function method<T extends CommonRequest, U extends CommonResponse>(
  method: string,
  fn: Fn<T, U>
) {
  const verb = method.toLowerCase();

  return async function methodMiddleware(req: T, next: () => Promise<U>) {
    if (req.method.toLowerCase() !== verb) return next();
    return fn(req, next);
  };
}

/**
 * Support shorthand path methods.
 */
export function create(verb: string) {
  return function pathWithMethod<
    T extends CommonRequest,
    U extends CommonResponse,
    P extends object = object
  >(str: Path, fn: Fn<T & RequestParams<P>, U>, options?: Options) {
    return path<T, U, P>(str, method(verb, fn), options);
  };
}

/**
 * Declare common methods.
 */
export const get = create("get");
export const head = create("head");
export const put = create("put");
export const post = create("post");
export const patch = create("patch");
export const del = create("delete");
export const options = create("options");
