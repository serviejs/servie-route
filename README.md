# Servie Route

[![NPM version](https://img.shields.io/npm/v/servie-route.svg?style=flat)](https://npmjs.org/package/servie-route)
[![NPM downloads](https://img.shields.io/npm/dm/servie-route.svg?style=flat)](https://npmjs.org/package/servie-route)
[![Build status](https://img.shields.io/travis/serviejs/servie-route.svg?style=flat)](https://travis-ci.org/serviejs/servie-route)
[![Test coverage](https://img.shields.io/coveralls/serviejs/servie-route.svg?style=flat)](https://coveralls.io/r/serviejs/servie-route?branch=master)

> Simple route middleware for Servie.

## Installation

```
npm install servie-route --save
```

## Usage

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

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
