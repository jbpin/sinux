---
sidebar_position: 2
---

# Signals

```typescript
const store = createStore({ items: [] }, {
  // Signal with handler: (state, ...args) => Partial<T>
  addItem: (state, item: string) => ({
    items: [...state.items, item]
  }),
});

// Dispatch: returns Promise
await store.addItem('hello');

// Stack handlers on the same signal (command pipeline)
store.addItem.add((state, item) => {
  console.log(`Added: ${item}`);
  return state; // return state to pass through
});
```

Signals are named async commands on the [store](/docs/concepts/store).

- Each signal is both callable (`store.signal(args)`) and a Signal instance (`store.signal.add(handler)`)
- Handlers receive `(state, ...args)` and return `Partial<T>` or `Promise<Partial<T>>`
- Multiple handlers on one signal execute sequentially, results are merged
- Handlers can return `void` for side effects
- Async handlers (Promises, async/await, generators) are awaited automatically
- **Signals return the updated store state, not raw data** — always read from `getState()`:

```typescript
// Signal updates the store — read state from the store
await store.addItem('hello');
const { items } = store.getState();
```

## String array vs record definition

```typescript
// Record: handlers attached at creation
createStore(state, { add: (s, item) => ({ items: [...s.items, item] }) });

// Array: just names, add handlers later
createStore(state, ['add', 'remove']);
store.add.add((state, item) => ({ items: [...state.items, item] }));
```

See also: [Store](/docs/concepts/store), [Middleware](/docs/concepts/middleware).
