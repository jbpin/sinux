---
sidebar_position: 1
---

# Persist

```typescript
import { createStore, persist } from '@sinuxjs/core';

const store = createStore(
  { theme: 'light', user: null },
  { setTheme: (s, theme) => ({ theme }) },
  [persist({
    key: 'app-settings',
    partialize: (state) => ({ theme: state.theme }), // only persist theme
  })]
);
```

State is saved to `localStorage` on every change and restored on init.

## Options

| Option | Type | Description |
|--------|------|-------------|
| `key` | `string` | Storage key |
| `storage` | `SinuxStorage` | Custom storage (default: localStorage) |
| `partialize` | `(state) => Partial<T>` | Select what to persist |
| `version` | `number` | Schema version for migrations |
| `migrate` | `(persisted, version) => T` | Migration function |

## Custom storage (React Native)

```typescript
persist({
  key: 'app',
  storage: AsyncStorage, // any { getItem, setItem, removeItem }
})
```
