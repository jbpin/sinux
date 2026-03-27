---
sidebar_position: 1
---

# Store

```typescript
import { createStore } from '@sinuxjs/core';

const store = createStore(
  { count: 0, name: 'world' },  // initial state
  {                               // signal definitions
    increment: (state) => ({ count: state.count + 1 }),
    setName: (state, name: string) => ({ name }),
  }
);

store.getState();              // { count: 0, name: 'world' }
await store.increment();
store.getState();              // { count: 1, name: 'world' }
await store.setName('Sinux');
store.getState();              // { count: 1, name: 'Sinux' }
```

A store holds your application state. `createStore(initialState, signals, middlewares?)` is the factory function.

- State updates are shallow merges (`{...state, ...partial}`)
- `getState()` returns a shallow copy (safe to read)
- `updateState(partial)` only triggers subscribers if state actually changed (shallow equality)
- `subscribe(callback)` returns an unsubscribe function
- `resetStore()` restores initial state

## API Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `getState()` | `T` | Shallow copy of current state |
| `updateState(partial)` | `T \| void` | Merge partial, notify if changed |
| `subscribe(cb)` | `() => void` | Subscribe, returns unsubscribe |
| `resetStore()` | `Promise` | Reset to initial state |

See also: [Signals](/docs/concepts/signals), [Middleware](/docs/concepts/middleware).
