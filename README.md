# Sinux
> Sinux is a Facebook Flux architecture implementation inspired by [signal-as3](https://github.com/robertpenner/as3-signals) and [SignalMapCommand](https://github.com/joelhooks/signals-extensions-CommandSignal) extension for [Robotlegs](http://www.robotlegs.org/).
Sinux use [co](https://github.com/tj/co) library

[![npm version](https://img.shields.io/npm/v/sinux.svg?style=flat-square)](https://www.npmjs.com/package/sinux)
[![npm downloads](https://img.shields.io/npm/dm/sinux.svg?style=flat-square)](https://www.npmjs.com/package/sinux)
[![Join the chat at https://gitter.im/jbpin/sinux](https://badges.gitter.im/jbpin/sinux.svg)](https://gitter.im/jbpin/sinux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Documentation
Visit the book, [Sinux, a flux implementation based on signal](https://jbpin.gitbooks.io/sinux-a-flux-implementation-based-on-signal/content/) to see the documentation and examples. 

## Philosophy behind Sinux
Read [this article on Medium](https://medium.com/@jbpin/why-do-i-write-sinux-a-flux-inspired-library-for-react-native-80e2ccce031c)

## Installation

Sinux is available on NPM

```
npm i sinux
```

```
yarn add sinux
```

## Usage

> Since version 0.2.0 Command objects are deprecated. Command are simple javascript function that can return a result or a function (see async below).

### Using babel6 with es2015


```javascript
import { Store } from sinux

const store = new Store({ initialState: true }, 'action','action2');

store.action.add( (state, ...args) => {...state, ...args} );

store.action({ foo:'bar' }).then( () => console.log( store.getState() ) );
// {initialState: true, foo: 'bar'}
```

### Using ES3

```javascript

var sinux = require('sinux');

var Store = sinux.Store;

var store = new Store({ initialState: true }, 'action','action2');

store.action.add( function (state) {
  // Array.prototype.slice.call(arguments,1)
  // ...
});

store.action({ foo:'bar' }).then(function () {
  console.log(store.getState())
});

```

### Asynchronous command

```javascript
// using generator function
store.action.add( (state, ...args) => {
  return function *(){
    let r = yield store.action2(...args)
    return r
  }()
});

// using Promise
store.action.add( (state, ...args) => {
  return new Promise((resolve, reject) => {
    setTimeout(()=> resolve(...args), 1000)
  })
})
```

## Exemple using Sinux with React Native

Here is a simple todo app made with Sinux and React Native. 
todoStore.load show how to do asynchronous call
[View source](https://gist.github.com/jbpin/ef823ce565baad0ac913)

## License
MIT

