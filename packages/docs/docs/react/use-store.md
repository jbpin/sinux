---
sidebar_position: 1
---

# useStore

```tsx
import { useStore } from '@sinuxjs/react';

function UserProfile() {
  // Full state
  const state = useStore(userStore);

  // With selector (recommended -- only re-renders when selected slice changes)
  const name = useStore(userStore, s => s.name);

  // With custom equality
  const items = useStore(store, s => s.items, (a, b) => a.length === b.length);
}
```

- Uses `useSyncExternalStoreWithSelector` internally -- concurrent-safe
- Selectors prevent unnecessary re-renders (only re-renders when selected value changes)
- Custom `equalityFn` for advanced comparison

## API

```typescript
function useStore<T, U>(
  store: Store<T>,
  selector?: (state: T) => U,
  equalityFn?: (a: U, b: U) => boolean
): U
```
