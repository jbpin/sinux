---
sidebar_position: 4
---

# Computed State

```typescript
import { createStore, computed, computedFrom } from '@sinuxjs/core';

const store = createStore({ firstName: 'John', lastName: 'Doe' }, {
  setFirst: (s, name: string) => ({ firstName: name }),
});

const fullName = computed(store, s => `${s.firstName} ${s.lastName}`);
fullName.get(); // 'John Doe'
fullName.subscribe(() => console.log(fullName.get()));
```

`computed(store, deriveFn)` creates a derived value that auto-updates.

- Only recomputes when `deriveFn` returns a new value (`Object.is` check)
- `computedFrom([store1, store2], (...states) => result)` for multi-store derivation
- Both return `{ get(), subscribe(cb) }` -- compatible with `useSyncExternalStore`

## In React

```tsx
import { useComputed } from '@sinuxjs/react';
const name = useComputed(fullName);
```

See also: [useComputed](/docs/react/use-computed).
