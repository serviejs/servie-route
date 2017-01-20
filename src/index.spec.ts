import { compose } from 'throwback'
import { get } from './index'
import { Request, Response } from 'servie'

describe('throwback-route', () => {
  it('should match a route', () => {
    const app = compose([
      get('/test', function (_req, res) {
        res.status = 200
        res.body = 'hello world'
      })
    ])

    const req = new Request({ method: 'get', url: '/test' })
    const res = new Response(req, {})

    return app(req, res, () => {
      res.status = 404

      return Promise.resolve()
    })
      .then(() => {
        expect(res.status).toBe(200)

        return res.text().then((body) => expect(body).toBe('hello world'))
      })
  })

  it('should not match when path does not equal', () => {
    const s = compose([
      get('/test', function (_req, res) {
        res.status = 200
        res.body = 'hello world'
      })
    ])

    const req = new Request({ method: 'get', url: '/' })
    const res = new Response(req, {})

    return s(req, res, () => {
      res.status = 404

      return Promise.resolve()
    })
      .then(() => expect(res.status).toBe(404))
  })

  it('should not match when method does not equal', () => {
    const app = compose([
      get('/test', function (_req, res) {
        res.status = 200
        res.body = 'hello world'
      })
    ])

    const req = new Request({ method: 'delete', url: '/test' })
    const res = new Response(req, {})

    return app(req, res, () => {
      res.status = 404

      return Promise.resolve()
    })
      .then(() => expect(res.status).toBe(404))
  })

  it('should work with parameters', () => {
    const animals = [
      'rabbit',
      'dog',
      'cat'
    ]

    const app = compose([
      get('/pets', function (_req, res) {
        res.body = animals
      }),
      get('/pets/:id', function (_req, res, params) {
        res.body = animals[Number(params[0])]
      })
    ])

    const req = new Request({ method: 'get', url: '/pets/1' })
    const res = new Response(req, {})

    return app(req, res, () => Promise.resolve())
      .then(() => {
        return res.text().then(body => expect(body).toEqual('dog'))
      })
  })
})
