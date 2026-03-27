# Core API

## createStore

```typescript
function createStore<T, U extends SignalDef<T>>(
  initialState: T,
  signals?: U,
  middlewares?: MiddlewareConfig<T>[]
): Store<T> & TransformArgumentsToSignalInstances<T, U>
```

- `initialState`: object with initial values.
- `signals`: record of `{ name: (state, ...args) => Partial<T> }` or string array `['name1', 'name2']`.
- `middlewares`: array of `MiddlewareConfig<T>` objects.

## Store\<T\>

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `getState()` | `() => T` | Returns shallow copy |
| `updateState(partial)` | `(Partial<T> \| void) => T \| void` | Merge + notify if changed (shallow equality) |
| `subscribe(cb)` | `(cb: () => void) => () => void` | Returns unsubscribe. Callback receives no arguments — use `getState()` to read current state. |
| `resetStore()` | `() => Promise<void>` | Reset to initial state |
| `addSignals(...signals)` | `(...(Signal \| string)[]) => void` | Add signals dynamically |

### Properties

- `state: T` — internal state (prefer `getState()`).
- `changed: Signal` — fires on state change.

## Signal\<T, U\>

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `add(handler)` | `(fn) => void` | Add command handler |
| `remove(handler)` | `(fn) => void` | Remove handler |
| `dispatch(...args)` | `(...args) => Promise` | Execute all handlers, merge results |

### Properties

- `commands: Set<Function>` — registered handlers.

### Signal Handler Signature

```typescript
(state: T, ...args) => Partial<T> | Promise<Partial<T>> | void
```

Multiple handlers merge results (objects spread, arrays concat).

### Async Behavior

**All signal calls are async and return Promises.** Always `await` them:

```typescript
await store.increment();       // ✓
await store.add(5);            // ✓
store.increment();             // ✗ fires but won't wait for completion
```

**Signals return the updated store state (or undefined), NOT raw data.** Never use the return value to access data — read from the store:

```typescript
// ✗ WRONG — return value is the full store state, not the API response
const data = await store.loadUsers();
data.find(u => u.id === 1); // crash: find is not a function

// ✓ CORRECT — signal updates the store, read state from the store
await store.loadUsers();
const { users } = store.getState();
users.find(u => u.id === 1); // works
```

This applies to all signals including `querySignal` and `mutationSignal`. The store is the source of truth — signals are commands that update it.

- **Promises**: Awaited automatically. Return `Promise<Partial<T>>`.
- **Generators**: Iterated sequentially. Yielded values are awaited, results passed back via `next()`. Final return value becomes state update.

## computed

```typescript
function computed<T, R>(
  store: Store<T>,
  deriveFn: (state: T) => R
): ComputedValue<R>
```

Memoized via `Object.is` — only notifies when value actually changes. Compatible with `useSyncExternalStore`.

## computedFrom

```typescript
function computedFrom<R>(
  stores: Store<any>[],
  deriveFn: (...states: any[]) => R
): ComputedValue<R>
```

Derives a value from multiple stores. Same memoization as `computed`.

## ComputedValue\<R\>

```typescript
interface ComputedValue<R> {
  get(): R;
  subscribe(cb: () => void): () => void;
}
```
