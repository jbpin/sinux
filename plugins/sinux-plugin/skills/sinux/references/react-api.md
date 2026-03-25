# React API

## useStore

```typescript
function useStore<T, U>(
  store: Store<T>,
  selector?: (state: T) => U,
  equalityFn?: (a: U, b: U) => boolean
): U
```

- Uses `useSyncExternalStoreWithSelector` — concurrent-safe.
- Without selector: returns full state, re-renders on any change.
- With selector: only re-renders when selected value changes.
- Custom `equalityFn` for shallow/deep comparison.

## useComputed

```typescript
function useComputed<R>(computedValue: ComputedValue<R>): R
```

- Subscribes to a `computed()` or `computedFrom()` value.
- Re-renders only when derived value changes.

## useStores

```typescript
function useStores<T extends Store<any>[], U>(
  combinedStore: CombinedStore<T>,
  selector?: (state: CombineStates<T>) => U,
  equalityFn?: (a: U, b: U) => boolean
): U
```

Used with `combine()`. Subscribes to multiple stores simultaneously.

## combine

```typescript
function combine<T extends Store<any>[]>(
  ...stores: T
): CombinedStore<T>
```

- Merges multiple store states into one object.
- Subscribes to all stores' changed signals.
- Returns `{ state, snapshot, subscribe }`.
