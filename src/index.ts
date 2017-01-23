import debug = require('debug')
import pathToRegexp = require('path-to-regexp')
import { Request, Response } from 'servie'

const log = debug('throwback-route')

export function create (verb?: string) {
  const method = verb ? verb.toUpperCase() : undefined

  return function <T extends Request> (
    path: pathToRegexp.Path,
    fn: (req: T, params: string[], done: () => Promise<Response>) => Response | Promise<Response>,
    options?: pathToRegexp.RegExpOptions
  ) {
    const re = pathToRegexp(path, options)

    log(`${method || 'all'} ${path} -> ${re}`)

    return function (req: T, next: () => Promise<Response>) {
      if (!matches(req, method)) {
        return next()
      }

      const m = req.Url.pathname && re.exec(req.Url.pathname)

      if (m) {
        const args = m.slice(1).map(decode)
        debug(`${req.method} ${path} matches ${req.Url.pathname} ${args}`)
        return fn(req, args, next)
      }

      return next()
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
function matches (req: Request, method: string | undefined) {
  return !method || (req.method === method) || (req.method === 'HEAD' && method === 'GET')
}
