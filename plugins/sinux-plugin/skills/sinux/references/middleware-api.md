# Middleware API

## MiddlewareConfig\<T\>

```typescript
type MiddlewareConfig<T> = {
  onInit?: (store: Store<T>) => void;
  onDispatch?: (context: {
    signalName: string;
    args: any[];
    getState: () => T;
    signal: Signal<T, any>;
    next: (...args: any[]) => Promise<Partial<T> | void>;
  }) => Promise<Partial<T> | void>;
  onStateChange?: (state: T, prevState: T, signalName: string) => void;
};
```

### Lifecycle

- **`onInit(store)`** — Called after store creation. Use for setup (hydration, subscriptions). Store ref available for direct `updateState()`.
- **`onDispatch(ctx)`** — Wraps signal dispatch. Call `ctx.next(state, ...args)` to continue chain. Return `Partial<T>` to set new state. Multiple middlewares compose via `reduceRight` (onion model).
- **`onStateChange(state, prevState, signalName)`** — Called after state actually changed (shallow equality passed). Use for side effects (logging, persistence, cache sync).

## Built-in: persist

```typescript
import { persist } from '@sinuxjs/core';

persist({
  key: string,
  storage?: SinuxStorage,
  partialize?: (state: T) => Partial<T>,
  version?: number,
  migrate?: (persisted: any, version: number) => T | Promise<T>,
})
```

- Saves to localStorage on every state change.
- Restores on init.
- `partialize`: only persist a subset of state.
- `version` + `migrate`: schema evolution across versions.
- Custom storage: any `{ getItem, setItem, removeItem }` (sync or async).

## Built-in: devtools

```typescript
import { devtools } from '@sinuxjs/core';

devtools({
  name?: string,
  enabled?: boolean,
})
```

- Connects to Redux DevTools browser extension.
- Signal names map to action types (zero config).
- `enabled: false` to disable in production.

## Built-in: immer

```typescript
import { immer } from '@sinuxjs/core';

immer()
```

- All signal handlers receive Immer draft.
- Mutate directly, immer produces immutable result.
- Backward compatible: returning objects still works.
- Requires `immer` as peer dependency.

## Custom Middleware Example: Validation

```typescript
const validate: MiddlewareConfig<MyState> = {
  onDispatch({ signalName, args, getState, next }) {
    if (signalName === 'setEmail' && !args[0]?.includes('@')) {
      return getState(); // reject: return current state unchanged
    }
    return next(getState(), ...args);
  }
};
```

## Custom Middleware Example: Debounce

```typescript
const debounce = (ms: number): MiddlewareConfig<any> => {
  const timers = new Map<string, NodeJS.Timeout>();
  return {
    onDispatch({ signalName, args, getState, next }) {
      return new Promise((resolve) => {
        clearTimeout(timers.get(signalName));
        timers.set(signalName, setTimeout(async () => {
          resolve(await next(getState(), ...args));
        }, ms));
      });
    }
  };
};
```
