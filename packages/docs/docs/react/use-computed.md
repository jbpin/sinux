---
sidebar_position: 2
---

# useComputed

```tsx
import { computed } from '@sinuxjs/core';
import { useComputed } from '@sinuxjs/react';

const totalPrice = computed(cartStore, s =>
  s.items.reduce((sum, item) => sum + item.price, 0)
);

function CartTotal() {
  const total = useComputed(totalPrice);
  return <span>${total.toFixed(2)}</span>;
}
```

- Subscribes to a [computed](/docs/concepts/computed) value
- Re-renders only when the derived value changes
- Uses `useSyncExternalStore` internally
