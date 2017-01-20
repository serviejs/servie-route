import debug = require('debug')
import pathToRegexp = require('path-to-regexp')
import { Request, Response } from 'servie'

const log = debug('throwback-route')

export function create (verb?: string) {
  const method = verb ? verb.toUpperCase() : undefined

  return function <T extends Request, U extends Response> (
    path: pathToRegexp.Path,
    fn: (req: T, res: U, params: string[], done: () => Promise<void>) => void | Promise<void>,
    options?: pathToRegexp.RegExpOptions
  ) {
    const re = pathToRegexp(path, options)

    log(`${method || 'all'} ${path} -> ${re}`)

    return function (req: T, res: U, next: () => Promise<void>) {
      if (!matches(req, method)) {
        return next()
      }

      const m = req.Url.pathname && re.exec(req.Url.pathname)

      if (m) {
        const args = m.slice(1).map(decode)
        debug(`${req.method} ${path} matches ${req.Url.pathname} ${args}`)
        return fn(req, res, args, next)
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
