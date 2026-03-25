<div align="center">

# ~ Sinux ~

**Signal-driven state management for React**

[![npm version](https://img.shields.io/npm/v/@sinuxjs/core.svg?style=flat-square&color=6C5CE7)](https://www.npmjs.com/package/@sinuxjs/core)
[![npm downloads](https://img.shields.io/npm/dm/@sinuxjs/core.svg?style=flat-square)](https://www.npmjs.com/package/@sinuxjs/core)
[![license](https://img.shields.io/npm/l/@sinuxjs/core.svg?style=flat-square)](https://github.com/jbpin/sinux/blob/master/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/jbpin/sinux/ci.yml?style=flat-square&label=tests)](https://github.com/jbpin/sinux/actions)

Sinux replaces free-form state mutators with **named, async, composable signals**.
Every action is traceable. Every mutation has a name.

[Documentation](https://jbpin.github.io/sinux) &bull; [Getting Started](https://jbpin.github.io/sinux/docs/getting-started) &bull; [Examples](https://jbpin.github.io/sinux/docs/examples/todo-app)

</div>

---

## Why Sinux?

| | Sinux | Zustand |
|---|---|---|
| **Actions** | Named signals on the store | Anonymous `set()` calls anywhere |
| **Async** | First-class &mdash; signals return Promises | Convention-based, DIY |
| **Pipeline** | Stack handlers on a signal with `.add()` | No equivalent |
| **Server state** | Built-in TanStack Query + Apollo adapters | Separate wiring |
| **Selectors** | `useSyncExternalStore` with selector | Same |

## Quick Start

```bash
npm install @sinuxjs/core @sinuxjs/react
```

```typescript
import { createStore } from '@sinuxjs/core';
import { useStore } from '@sinuxjs/react';

// Create a store with named signals
const counterStore = createStore(
  { count: 0 },
  {
    increment: (state) => ({ count: state.count + 1 }),
    add: (state, amount: number) => ({ count: state.count + amount }),
  }
);

// Use in React
function Counter() {
  const { count } = useStore(counterStore, (s) => ({ count: s.count }));
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => counterStore.increment()}>+1</button>
      <button onClick={() => counterStore.add(10)}>+10</button>
    </div>
  );
}
```

## Signals

Signals are named async commands. They receive state, return partial updates, and compose naturally.

```typescript
const store = createStore({ items: [] }, {
  // Sync
  addItem: (state, item) => ({ items: [...state.items, item] }),

  // Async
  loadItems: async (state) => {
    const items = await fetch('/api/items').then(r => r.json());
    return { items };
  },
});

await store.addItem('hello');
await store.loadItems();

// Stack handlers on the same signal (command pipeline)
store.addItem.add((state, item) => {
  analytics.track('item_added', { item });
});
```

## Middleware

Third argument to `createStore`. Three hooks: `onInit`, `onDispatch`, `onStateChange`.

```typescript
import { createStore, persist, devtools, immer } from '@sinuxjs/core';

const store = createStore(
  { todos: [] },
  {
    addTodo: (state, text) => {
      state.todos.push({ text, done: false }); // immer draft
    },
    toggle: (state, index) => {
      state.todos[index].done = !state.todos[index].done;
    },
  },
  [
    persist({ key: 'todos' }),         // localStorage persistence
    devtools({ name: 'Todo Store' }),  // Redux DevTools
    immer(),                           // mutable-style updates
  ]
);
```

<details>
<summary><strong>Custom middleware</strong></summary>

```typescript
const logger = {
  onStateChange(state, prevState, signalName) {
    console.log(`[${signalName}]`, prevState, '→', state);
  },
};

const validator = {
  onDispatch({ signalName, args, getState, next }) {
    if (signalName === 'setEmail' && !args[0]?.includes('@')) {
      return getState(); // reject
    }
    return next(getState(), ...args);
  },
};
```

</details>

## Computed State

```typescript
import { computed } from '@sinuxjs/core';
import { useComputed } from '@sinuxjs/react';

const activeTodos = computed(todoStore, (s) =>
  s.todos.filter((t) => !t.done)
);

function ActiveCount() {
  const todos = useComputed(activeTodos);
  return <span>{todos.length} remaining</span>;
}
```

## Multi-Store

Signals can trigger other stores. Generators orchestrate sequential flows.

```typescript
authStore.login.add(async (state, email, password) => {
  await cartStore.load();
  await notificationStore.add('Welcome back!');
});

// Or with generators
authStore.login.add((state, email, password) => {
  return function* () {
    yield cartStore.load();
    yield notificationStore.add('Welcome back!');
  }();
});
```

Subscribe to multiple stores in React:

```tsx
import { combine, useStores } from '@sinuxjs/react';

const app = combine(authStore, cartStore);
const { user, items } = useStores(app, (s) => ({ user: s.user, items: s.items }));
```

## Server State

### TanStack Query

```bash
npm install @sinuxjs/tanstack-query @tanstack/react-query
```

```typescript
import { querySignal, mutationSignal, tanstackQuery } from '@sinuxjs/tanstack-query';

const store = createStore(
  { users: [], loading: false },
  {
    loadUsers: querySignal({
      queryKey: ['users'],
      queryFn: () => fetch('/api/users').then((r) => r.json()),
      mapToState: (data) => ({ users: data, loading: false }),
      onFetch: () => ({ loading: true }),
    }),
    createUser: mutationSignal({
      mutationFn: (user) => api.post('/users', user),
      optimistic: (state, user) => ({ users: [...state.users, { ...user, id: 'temp' }] }),
      mapToState: (data, state) => ({ users: state.users.map((u) => u.id === 'temp' ? data : u) }),
      invalidates: [['users']],
    }),
  },
  [tanstackQuery({ queryClient })]
);
```

<details>
<summary><strong>tRPC adapter</strong></summary>

```typescript
import { fromTRPC } from '@sinuxjs/tanstack-query/trpc';

const store = createStore(
  { users: [] },
  fromTRPC(trpc, {
    loadUsers: { procedure: 'users.list', type: 'query', mapToState: (d) => ({ users: d }) },
    createUser: { procedure: 'users.create', type: 'mutation', mapToState: (d, s) => ({ users: [...s.users, d] }) },
  }),
  [tanstackQuery({ queryClient })]
);
```

</details>

### Apollo Client

```bash
npm install @sinuxjs/apollo @apollo/client graphql
```

```typescript
import { graphqlQuery, graphqlMutation, apolloClient } from '@sinuxjs/apollo';
import { gql } from '@apollo/client';

const store = createStore(
  { users: [], loading: false },
  {
    loadUsers: graphqlQuery({
      query: gql`query { users { id name } }`,
      mapToState: (data) => ({ users: data.users, loading: false }),
      onFetch: () => ({ loading: true }),
    }),
    createUser: graphqlMutation({
      mutation: gql`mutation CreateUser($input: UserInput!) { createUser(input: $input) { id name } }`,
      variables: (input) => ({ input }),
      mapToState: (data, state) => ({ users: [...state.users, data.createUser] }),
      refetchQueries: [gql`query { users { id name } }`],
    }),
  },
  [apolloClient({ client: apolloInstance })]
);
```

## Packages

| Package | Description |
|---------|-------------|
| [`@sinuxjs/core`](https://www.npmjs.com/package/@sinuxjs/core) | Store, Signal, createStore, computed, middlewares |
| [`@sinuxjs/react`](https://www.npmjs.com/package/@sinuxjs/react) | useStore, useComputed, combine |
| [`@sinuxjs/tanstack-query`](https://www.npmjs.com/package/@sinuxjs/tanstack-query) | TanStack Query + tRPC integration |
| [`@sinuxjs/apollo`](https://www.npmjs.com/package/@sinuxjs/apollo) | Apollo Client integration |

## Claude Code Plugin

Teach Claude how to work with Sinux:

```
/plugin marketplace add jbpin/sinux
/plugin install sinux-plugin@sinux-marketplace
```

## Contributing

```bash
git clone https://github.com/jbpin/sinux.git
cd sinux
yarn install
cd packages/core && ../../node_modules/.bin/rollup -c ../../rollup.config.mjs
cd ../react && ../../node_modules/.bin/rollup -c ../../rollup.config.mjs
cd ../.. && node_modules/.bin/mocha test/sinux.js test/v2-features.js --timeout 5000
```

## License

MIT
