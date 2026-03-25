# Apollo Client Integration API

## Install

```bash
npm install @sinuxjs/apollo @apollo/client graphql
```

## graphqlQuery

```typescript
function graphqlQuery<T, TData, TVars>(opts: {
  query: DocumentNode | TypedDocumentNode<TData, TVars>;
  variables?: TVars | ((...args: any[]) => TVars);
  mapToState: (data: TData, state: T) => Partial<T>;
  onFetch?: (state: T) => Partial<T>;
  onError?: (error: Error, state: T) => Partial<T>;
  fetchPolicy?: WatchQueryFetchPolicy;
})
```

Requires `apolloClient()` middleware — no fallback without it.

- `query`: GraphQL document node.
- `variables`: static object or function deriving variables from signal args.
- `mapToState`: transform query result into state partial.
- `onFetch`: state update applied immediately when fetch starts.
- `onError`: state update on error.
- `fetchPolicy`: Apollo fetch policy (`cache-first`, `network-only`, etc.).

## graphqlMutation

```typescript
function graphqlMutation<T, TData, TVars>(opts: {
  mutation: DocumentNode | TypedDocumentNode<TData, TVars>;
  variables?: TVars | ((...args: any[]) => TVars);
  mapToState: (data: TData, state: T) => Partial<T>;
  optimistic?: (state: T, ...args: any[]) => Partial<T>;
  optimisticResponse?: any | ((...args: any[]) => any);
  onError?: (error: Error, state: T) => Partial<T> | void;
  refetchQueries?: DocumentNode[];
  update?: (cache: ApolloCache<any>, result: FetchResult<TData>) => void;
})
```

- `optimistic`: immediate state update before mutation completes.
- `optimisticResponse`: passed to Apollo's `optimisticResponse` option for cache updates.
- `refetchQueries`: queries to refetch after successful mutation.
- `update`: direct Apollo cache update function.

## apolloClient Middleware

```typescript
function apolloClient<T>(opts: {
  client: ApolloClient<any> | (() => ApolloClient<any>);
}): MiddlewareConfig<T>
```

- Routes `graphqlQuery` signals through `client.query()`.
- Routes `graphqlMutation` signals through `client.mutate()` with `optimisticResponse` + `refetchQueries`.
- Cache-to-store sync via `client.watchQuery().subscribe()`.
- Optimistic rollback on error.

## Full Example

```typescript
import { createStore } from '@sinuxjs/core';
import { graphqlQuery, graphqlMutation, apolloClient } from '@sinuxjs/apollo';
import { gql } from '@apollo/client';

const GET_USERS = gql`query { users { id name } }`;
const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) { id name }
  }
`;

const store = createStore(
  { users: [], loading: false },
  {
    loadUsers: graphqlQuery({
      query: GET_USERS,
      mapToState: (d) => ({ users: d.users, loading: false }),
      onFetch: () => ({ loading: true }),
    }),
    createUser: graphqlMutation({
      mutation: CREATE_USER,
      variables: (input) => ({ input }),
      mapToState: (d, s) => ({ users: [...s.users, d.createUser] }),
      refetchQueries: [GET_USERS],
    }),
  },
  [apolloClient({ client: apolloInstance })]
);
```
