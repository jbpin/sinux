---
sidebar_position: 3
---

# Multi-Store

```tsx
import { combine, useStores } from '@sinuxjs/react';

const combined = combine(userStore, cartStore);

function Header() {
  const { name, items } = useStores(combined, s => ({
    name: s.name,
    items: s.items,
  }));
  return <div>{name} ({items.length} items)</div>;
}
```

- `combine(...stores)` merges multiple store states
- `useStores(combined, selector?)` subscribes to all stores
- Re-renders when any source store's selected state changes
