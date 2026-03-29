---
sidebar_position: 2
---

# DevTools

```typescript
import { createStore, devtools } from '@sinuxjs/core';

const store = createStore(
  { count: 0 },
  { increment: (s) => ({ count: s.count + 1 }) },
  [devtools({ name: 'Counter Store' })]
);
```

Connects to the [Redux DevTools](https://github.com/reduxjs/redux-devtools) browser extension. Every signal dispatch appears as a named action.

## Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Store name in DevTools (default: 'Sinux Store') |
| `enabled` | `boolean` | Disable in production |

Sinux's named [signals](/docs/concepts/signals) map perfectly to Redux action types -- no extra configuration needed.
