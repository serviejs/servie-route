import debug = require('debug')
import pathToRegexp = require('path-to-regexp')
import { Request, Response } from 'servie'

const log = debug('servie-route')

export interface RequestParams {
  params: string[]
}

/**
 * Create a method handler (used internally to create `get`, `post`, etc).
 */
export function create (verb?: string) {
  const matches = toMatch(verb)

  return function <T extends Request> (
    path: pathToRegexp.Path,
    fn: (req: T & RequestParams, done: () => Promise<Response>) => Response | Promise<Response>,
    options?: pathToRegexp.RegExpOptions
  ) {
    const keys: pathToRegexp.Key[] = []
    const re = pathToRegexp(path, keys, options)

    log(`${verb || '*'} ${path} -> ${re}`)

    return function (req: T, next: () => Promise<Response>): Promise<Response> {
      if (!matches(req)) return next()

      const m = req.Url.pathname && re.exec(req.Url.pathname)

      if (!m) return next()

      const params = m.slice(1).map(decode)
      debug(`${req.method} ${path} matches ${req.Url.pathname} ${params}`)
      return Promise.resolve(fn(Object.assign(req, { params }), next))
    }
  }
}

/**
 * Declare common methods.
 */
export const all = create()
export const get = create('get')
export const put = create('put')
export const post = create('post')
export const patch = create('patch')
export const del = create('delete')

/**
 * Decode path fragments.
 */
function decode (value: string | undefined) {
  return value ? decodeURIComponent(value) : ''
}

/**
 * Check request matches.
 */
function toMatch (verb?: string): (req: Request) => boolean {
  if (!verb) return () => true

  const method = verb.toLowerCase()

  if (method === 'get') {
    return req => {
      const m = req.method.toLowerCase()
      return m === 'get' || m === 'head'
    }
  }

  return req => req.method.toLowerCase() === method
}
