---
title: "Apollo Client Integration"
specId: "01af8cde-3ea4-436c-aab7-20420fa89556"
generation: 1
status: "active"
type: "capability"
category: "feature"
tags: ["apollo", "graphql", "server-state", "cache"]
source: "spekn-export"
---

# Apollo Client Integration

## Full Specification

# Apollo Client Integration

**Generation**: 1

## Overview

The `@sinuxjs/apollo` package bridges Sinux stores with Apollo Client's GraphQL caching layer. GraphQL queries and mutations are expressed as signal handlers, which the `apolloClient` middleware intercepts to delegate to `ApolloClient`. Cache-to-store synchronization uses Apollo's `watchQuery` to push cache updates into the store. The pattern mirrors `@sinuxjs/tanstack-query` for consistency across server-state integrations.

## Spec Anchors

### #apollo.query.signal

**User Story**: As a developer using GraphQL, I need to express queries as store signals so that GraphQL data integrates with my Sinux state flow.

**Acceptance Criteria**:

- [ ] `graphqlQuery(opts)` returns a handler with `GRAPHQL_QUERY` metadata attached
- [ ] `query` accepts a `DocumentNode` or `TypedDocumentNode` for type-safe queries
- [ ] `variables` accepts a static object or a function `(...args) => TVars`
- [ ] `mapToState(data, state)` maps query result to partial store state
- [ ] `onFetch(state, ...args)` returns interim state before fetch
- [ ] `onError(error, state, ...args)` handles query failures
- [ ] `fetchPolicy` option passes through to `ApolloClient.query`

**Constraints**: Without the `apolloClient` middleware, `graphqlQuery` throws an error. Variables are resolved at dispatch time if provided as a function.

**Dependencies**: #core.signal.dispatch

**Technical Context**: Implemented in `packages/apollo/src/graphql-query.ts`. Metadata attached via `Object.defineProperty(handler, GRAPHQL_QUERY, { value: opts })`. Types in `packages/apollo/src/types.ts`.

### #apollo.mutation.signal

**User Story**: As a developer using GraphQL, I need optimistic mutations so that the UI updates immediately while the server processes the GraphQL mutation.

**Acceptance Criteria**:

- [ ] `graphqlMutation(opts)` returns a handler with `GRAPHQL_MUTATION` metadata
- [ ] `mutation` accepts a `DocumentNode` for the GraphQL mutation
- [ ] `variables` accepts a static object or a function `(...args) => TVars`
- [ ] `optimistic(state, ...args)` applies immediate store state before server response
- [ ] `optimisticResponse` passes through to `ApolloClient.mutate` for Apollo cache optimism
- [ ] On mutation error, store state rolls back to pre-optimistic state
- [ ] `refetchQueries` array of DocumentNodes are refetched after successful mutation
- [ ] `update(cache, result)` callback allows manual Apollo cache manipulation

**Constraints**: Store rollback and Apollo cache rollback are independent; store uses `updateState(prevState)`, Apollo uses its built-in optimistic response mechanism.

**Dependencies**: #core.signal.dispatch

**Technical Context**: Implemented in `packages/apollo/src/graphql-mutation.ts`. Rollback captures `store.getState()` before optimistic update.

### #apollo.middleware.dispatch

**User Story**: As a developer, I need the middleware to route GraphQL signals through ApolloClient so that I get Apollo's normalized cache and network layer.

**Acceptance Criteria**:

- [ ] `apolloClient({ client })` returns a `MiddlewareConfig<T>`
- [ ] `onInit` scans store signals for `GRAPHQL_QUERY` metadata and sets up cache sync via `watchQuery`
- [ ] `onDispatch` intercepts query signals and calls `client.query()`
- [ ] `onDispatch` intercepts mutation signals and calls `client.mutate()`
- [ ] Cache sync uses a counter to prevent infinite update loops
- [ ] `client` option accepts an `ApolloClient` instance or a factory function

**Constraints**: Cache sync subscribes via `client.watchQuery({ query, variables }).subscribe()`. Sync counter pattern matches `@sinuxjs/tanstack-query` for consistency.

**Dependencies**: #core.middleware.pipeline

**Technical Context**: Implemented in `packages/apollo/src/middleware.ts`. Cache sync in `packages/apollo/src/cache-sync.ts`. Uses `ObservableQuery.subscribe` for next/error callbacks.

## Global Constraints

- Peer dependencies: `@sinuxjs/core@>=1.0.0`, `@apollo/client@>=3.8`, `graphql@>=16`
- Single entry point: `packages/apollo/src/index.ts`
- API surface mirrors `@sinuxjs/tanstack-query` for consistency

## Spekn Tracking Rules

- Treat this document as locked context; do not reinterpret requirements outside Spekn flow.
- Review `../decisions/INDEX.md` before implementation and whenever scope changes.
- If implementation conflicts with this spec or approved decisions, stop and escalate for a Spekn decision update.

## Related Decisions

- Shorthand index: [Approved Decisions](../decisions/INDEX.md)
