import { compose } from 'throwback'
import { get } from './index'
import { Request, Response } from 'servie'
import { createBody } from 'servie/dist/body/node'
import { send } from 'servie-send'
import { finalhandler } from 'servie-finalhandler'

describe('servie-route', () => {
  it('should match a route', async () => {
    const app = compose([
      get('/test', req => send(req, 'hello world'))
    ])

    const req = new Request({ method: 'get', url: '/test' })
    const res = await app(req, finalhandler(req))

    expect(res.statusCode).toBe(200)
    expect(await res.body.text()).toBe('hello world')
  })

  it('should not match when path does not equal', async () => {
    const app = compose([
      get('/test', req => send(req, 'hello world'))
    ])

    const req = new Request({ method: 'get', url: '/' })
    const res = await app(req, finalhandler(req))

    expect(res.statusCode).toEqual(404)
  })

  it('should not match when method does not equal', async () => {
    const app = compose([
      get('/test', req => send(req, 'hello world'))
    ])

    const req = new Request({ method: 'delete', url: '/test' })
    const res = await app(req, finalhandler(req))

    expect(res.statusCode).toBe(404)
  })

  it('should work with parameters', async () => {
    const animals = ['rabbit', 'dog', 'cat']

    const app = compose([
      get('/pets', function () {
        return new Response({ body: createBody(animals) })
      }),
      get('/pets/:id', function (req) {
        return new Response({ body: createBody(animals[Number(req.params[0])]) })
      })
    ])

    const req = new Request({ method: 'get', url: '/pets/1' })
    const res = await app(req, finalhandler(req))

    expect(await res.body.text()).toEqual('dog')
  })
})
