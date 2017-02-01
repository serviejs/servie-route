# Servie Route

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Simple route middleware for Servie.

## Installation

```
npm install servie-route --save
```

## Usage

```ts
import { get, post } from 'servie-route'
import { compose } from 'throwback'

const animals = [
  'rabbit',
  'dog',
  'cat'
]

const app = compose([
  get('/pets', function () {
    return new Response({ body: animals })
  }),
  get('/pets/:id', function (req) {
    return new Response({ body: animals[Number(req.params[0])] })
  })
])
```

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/servie-route.svg?style=flat
[npm-url]: https://npmjs.org/package/servie-route
[downloads-image]: https://img.shields.io/npm/dm/servie-route.svg?style=flat
[downloads-url]: https://npmjs.org/package/servie-route
[travis-image]: https://img.shields.io/travis/blakeembrey/node-servie-route.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/node-servie-route
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/node-servie-route.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/node-servie-route?branch=master
