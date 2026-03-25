---
sidebar_position: 1
---

# What is Sinux?

```typescript
import { createStore } from '@sinuxjs/core';
import { useStore } from '@sinuxjs/react';

const counterStore = createStore(
  { count: 0 },
  { increment: (state) => ({ count: state.count + 1 }) }
);

function Counter() {
  const { count } = useStore(counterStore);
  return <button onClick={() => counterStore.increment()}>Count: {count}</button>;
}
```

Sinux is a signal-driven state management library for React. Built on Facebook's Flux architecture, it replaces free-form mutators with **named, composable signals**.

- **Named Signals**: Every action is a named method on the store. Traceable, composable, enumerable.
- **First-class Async**: Signal handlers return Promises. No thunks, no sagas, no extra middleware.
- **Command Pipeline**: Stack multiple handlers on one signal with `store.signal.add()`.

Ready? Jump to [Getting Started](/docs/getting-started).
