---
description: "Sinux is a signal-driven state management library for React implementing Flux architecture. Stores hold state, signals are named async commands that update it. Use this skill when working with @sinuxjs/core, @sinuxjs/react, @sinuxjs/tanstack-query, or @sinuxjs/apollo — for creating stores, writing signal handlers, building middleware, integrating with TanStack Query or Apollo Client, or any Sinux-related code."
---

# Sinux

## Install

```bash
npm install @sinuxjs/core @sinuxjs/react
```

## Create a Store

Use `createStore` with record-style signals:

```typescript
import { createStore } from '@sinuxjs/core';

const store = createStore(
  { count: 0 },
  {
    increment: (state) => ({ count: state.count + 1 }),
    add: (state, amount: number) => ({ count: state.count + amount }),
  }
);

await store.increment(); // { count: 1 }
```

Signal handler signature: `(state: T, ...args) => Partial<T> | Promise<Partial<T>> | void`

Signals return Promises. Async/await and generators work natively.

For full Store/Signal API, see [core-api.md](references/core-api.md).

## React

```tsx
import { useStore } from '@sinuxjs/react';

const { count } = useStore(store, s => ({ count: s.count }));
```

Selector = only re-render when selected slice changes.

For useComputed, combine, useStores, see [react-api.md](references/react-api.md).

## Middleware

Third argument to `createStore`. Three hooks: `onInit`, `onDispatch`, `onStateChange`.

```typescript
const logger: MiddlewareConfig<MyState> = {
  onStateChange(state, prev, signalName) {
    console.log(`[${signalName}]`, prev, '→', state);
  }
};

const store = createStore(state, signals, [logger, persist({ key: 'app' }), devtools()]);
```

Built-in: `persist`, `devtools`, `immer`. For full middleware API + custom patterns, see [middleware-api.md](references/middleware-api.md).

## Server State (TanStack Query)

```typescript
import { querySignal, mutationSignal, tanstackQuery } from '@sinuxjs/tanstack-query';

const store = createStore(
  { users: [] },
  {
    loadUsers: querySignal({
      queryKey: ['users'],
      queryFn: () => fetch('/api/users').then(r => r.json()),
      mapToState: (data) => ({ users: data }),
    }),
    addUser: mutationSignal({
      mutationFn: (user) => api.post('/users', user),
      mapToState: (data, s) => ({ users: [...s.users, data] }),
      invalidates: [['users']],
    }),
  },
  [tanstackQuery({ queryClient })]
);
```

For full API, optimistic updates, useQuerySignal, fromTRPC, see [tanstack-query-api.md](references/tanstack-query-api.md).

## Server State (Apollo Client)

```typescript
import { graphqlQuery, graphqlMutation, apolloClient } from '@sinuxjs/apollo';

const store = createStore(
  { users: [] },
  {
    loadUsers: graphqlQuery({
      query: GET_USERS,
      mapToState: (d) => ({ users: d.users }),
    }),
    createUser: graphqlMutation({
      mutation: CREATE_USER,
      variables: (input) => ({ input }),
      mapToState: (d, s) => ({ users: [...s.users, d.createUser] }),
    }),
  },
  [apolloClient({ client })]
);
```

For full GraphQL API, see [apollo-api.md](references/apollo-api.md).

## Patterns

- **Multi-store**: Call `await otherStore.signal()` inside a handler
- **Command pipeline**: `store.signal.add(handler)` stacks handlers
- **Generators**: `yield otherStore.signal()` for sequential orchestration
- **Computed**: `computed(store, s => derived)` + `useComputed(c)` in React

For multi-store patterns, optimistic updates, rollback, see [patterns.md](references/patterns.md).
