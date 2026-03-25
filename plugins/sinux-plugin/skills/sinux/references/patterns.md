# Patterns

## Multi-Store Triggering

Signal handlers can call other stores directly:

```typescript
authStore.login.add(async (state, email, password) => {
  await cartStore.load();
  await notificationStore.add('Welcome back!');
});
```

## Command Pipeline

Stack multiple handlers on one signal:

```typescript
// Primary handler
store.addTodo.add((state, text) => ({
  todos: [...state.todos, { text, done: false }],
}));

// Side-effect handler (return void = no state change)
store.addTodo.add((state, text) => {
  analytics.track('todo_added', { text });
});
```

## Generators for Orchestration

```typescript
store.checkout.add((state) => {
  return function* () {
    yield cartStore.validate();
    yield paymentStore.charge();
    yield orderStore.create();
    return { status: 'completed' };
  }();
});
```

Each `yield` awaits the other store's signal. The final return value becomes the state update.

## Optimistic Update + Rollback

With TanStack Query:

```typescript
addTodo: mutationSignal({
  mutationFn: (text) => api.post('/todos', { text }),
  optimistic: (state, text) => ({
    todos: [...state.todos, { text, id: 'temp', pending: true }],
  }),
  mapToState: (data, state) => ({
    todos: state.todos.map(t => t.id === 'temp' ? data : t),
  }),
  invalidates: [['todos']],
})
```

On error: store rolls back to pre-optimistic state automatically.

## Computed from Multiple Stores

```typescript
import { computedFrom } from '@sinuxjs/core';

const cartTotal = computedFrom(
  [cartStore, promoStore],
  (cartState, promoState) => {
    const subtotal = cartState.items.reduce((sum, i) => sum + i.price, 0);
    return promoState.discount
      ? subtotal * (1 - promoState.discount)
      : subtotal;
  }
);
```

Use in React:

```tsx
import { useComputed } from '@sinuxjs/react';

function CartTotal() {
  const total = useComputed(cartTotal);
  return <span>{total}</span>;
}
```

## Subscribe to State Changes (Outside React)

```typescript
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
});

// later:
unsubscribe();
```

## Dynamic Signals

Add signals after store creation:

```typescript
store.addSignals('newSignal');
store.newSignal.add((state, value) => ({ dynamicField: value }));
await store.newSignal('hello');
```

## Reset Store

```typescript
await store.resetStore(); // returns to initialState
```
