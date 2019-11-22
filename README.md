# Servie Route

[![NPM version](https://img.shields.io/npm/v/servie-route.svg?style=flat)](https://npmjs.org/package/servie-route)
[![NPM downloads](https://img.shields.io/npm/dm/servie-route.svg?style=flat)](https://npmjs.org/package/servie-route)
[![Build status](https://img.shields.io/travis/serviejs/servie-route.svg?style=flat)](https://travis-ci.org/serviejs/servie-route)
[![Test coverage](https://img.shields.io/coveralls/serviejs/servie-route.svg?style=flat)](https://coveralls.io/r/serviejs/servie-route?branch=master)

> Simple route middleware for Servie using [Path-To-Regexp](https://github.com/pillarjs/path-to-regexp).

## Installation

```
npm install servie-route --save
```

## Usage

The package exposes common HTTP methods: `get`, `head`, `put`, `post`, `patch`, `del`, and `options`.

```ts
import { get, post } from "servie-route";
import { compose } from "throwback";

const animals = ["rabbit", "dog", "cat"];

const app = compose([
  get("/pets", function() {
    return new Response(animals.join("\n"));
  }),
  get("/pets/:id", function(req) {
    return new Response(animals[Number(req.params[0])]);
  })
]);
```

### Composition

If you need raw control, the package also exposes the internally used functions: `method` and `path`.

- `method(method, fn)` - Match an incoming request against a HTTP method.
- `path(path, fn, options?)` - Match an incoming request against a [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) path.

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
