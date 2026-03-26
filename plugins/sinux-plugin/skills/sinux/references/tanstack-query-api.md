# TanStack Query Integration API

## Install

```bash
npm install @sinuxjs/tanstack-query @tanstack/react-query
```

## querySignal

```typescript
function querySignal<T, TData = any, TArgs extends any[] = any[]>(opts: {
  queryKey: QueryKey | ((...args: TArgs) => QueryKey);
  queryFn: (...args: TArgs) => Promise<TData>;
  mapToState: (data: TData, state: T) => Partial<T>;
  onFetch?: (state: T, ...args: TArgs) => Partial<T>;
  onError?: (error: unknown, state: T, ...args: TArgs) => Partial<T>;
  staleTime?: number;
  gcTime?: number;
  select?: (data: TData) => any;
})
```

Returns a signal handler with `QUERY_SIGNAL` metadata. Without the `tanstackQuery` middleware: falls back to direct fetch via `queryFn`.

`TArgs` is inferred from `queryFn` — signal args are fully typed and passed through to `queryKey`, `queryFn`, `onFetch`, and `onError`.

- `queryKey`: static array or function deriving key from signal args.
- `queryFn`: fetch function — receives the signal's args (e.g. `await store.loadUser(id)` → `queryFn: (id) => fetch(...)`).
- `mapToState`: transform query data into state partial.
- `onFetch`: state update applied immediately when fetch starts (use for loading flags).
- `onError`: state update on error.

## mutationSignal

```typescript
function mutationSignal<T, TData = any, TArgs extends any[] = any[]>(opts: {
  mutationFn: (...args: TArgs) => Promise<TData>;
  mapToState: (data: TData, state: T) => Partial<T>;
  optimistic?: (state: T, ...args: TArgs) => Partial<T>;
  onError?: (error: unknown, state: T, ...args: TArgs) => Partial<T> | void;
  invalidates?: QueryKey[];
  awaitInvalidation?: boolean;
})
```

Optimistic flow:
1. Immediate state update via `optimistic`.
2. Mutation executes via `mutationFn`.
3. On success: reconcile with `mapToState` + invalidate queries listed in `invalidates`.
4. On error: rollback to pre-optimistic state automatically.

- `invalidates`: query keys to refetch after successful mutation.
- `awaitInvalidation`: if `true`, signal awaits invalidation before resolving.

## tanstackQuery Middleware

```typescript
function tanstackQuery<T>(opts: {
  queryClient: QueryClient | (() => QueryClient);
}): MiddlewareConfig<T>
```

- Intercepts query/mutation signals in `onDispatch`.
- Routes through QueryClient (`fetchQuery` / `mutate`).
- Sets up cache-to-store sync via `watchQuery` subscriptions.
- Handles optimistic update + rollback.

## useQuerySignal (React)

```typescript
import { useQuerySignal } from '@sinuxjs/tanstack-query/react';

function useQuerySignal<T, U>(
  store: Store<T>,
  signalName: string,
  args?: any[],
  selector?: (state: T) => U
): U
```

- Auto-fetches on mount.
- Re-fetches when `args` change.
- Returns selected state slice.

## fromTRPC

```typescript
import { fromTRPC } from '@sinuxjs/tanstack-query/trpc';

function fromTRPC<T>(
  trpcClient: any,
  procedures: Record<string, {
    procedure: string;
    type: 'query' | 'mutation';
    mapToState: (data: any, state: T) => Partial<T>;
    optimistic?: (state: T, ...args: any[]) => Partial<T>;
    invalidates?: string[];
  }>
): Record<string, SignalHandler>
```

Maps tRPC procedures to Sinux signals.

### Example

```typescript
const store = createStore(
  { users: [] },
  fromTRPC(trpc, {
    loadUsers: {
      procedure: 'users.list',
      type: 'query',
      mapToState: (d) => ({ users: d }),
    },
    createUser: {
      procedure: 'users.create',
      type: 'mutation',
      mapToState: (d, s) => ({ users: [...s.users, d] }),
      invalidates: ['users.list'],
    },
  }),
  [tanstackQuery({ queryClient })]
);
```
