import debug = require("debug");
import { pathToRegexp, TokensToRegexpOptions, Path } from "path-to-regexp";
import { CommonRequest, CommonResponse } from "servie/dist/common";
import { getURL } from "servie-url";

const log = debug("servie-route");

export interface RequestParams {
  params: string[];
}

/**
 * Create a method handler (used internally to create `get`, `post`, etc).
 */
export function create(verb?: string) {
  const matches = toMatch(verb);

  return function<T extends CommonRequest, U extends CommonResponse>(
    path: Path,
    fn: (req: T & RequestParams, done: () => Promise<U>) => U | Promise<U>,
    options?: TokensToRegexpOptions
  ) {
    const re = pathToRegexp(path, undefined, {
      encode: encodeURI,
      ...options
    });

    log(`${verb || "*"} ${path} -> ${re}`);

    return function(req: T, next: () => Promise<U>): Promise<U> {
      if (!matches(req.method)) return next();

      const { pathname } = getURL(req);
      const m = re.exec(pathname);

      if (!m) return next();

      const params = m.slice(1).map(decode);
      debug(`${req.method} ${path} matches ${pathname} ${params}`);
      return Promise.resolve(fn(Object.assign(req, { params }), next));
    };
  };
}

/**
 * Declare common methods.
 */
export const all = create();
export const get = create("get");
export const put = create("put");
export const post = create("post");
export const patch = create("patch");
export const del = create("delete");

/**
 * Decode path fragments.
 */
function decode(value: string | undefined) {
  return value ? decodeURIComponent(value) : "";
}

/**
 * Check method matches.
 */
function toMatch(verb?: string): (method: string) => boolean {
  if (!verb) return () => true;

  const method = verb.toLowerCase();

  if (method === "get") {
    return m => {
      const _m = m.toLowerCase();
      return _m === "get" || _m === "head";
    };
  }

  return m => m.toLowerCase() === method;
}
