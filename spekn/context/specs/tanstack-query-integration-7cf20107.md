---
title: "TanStack Query Integration"
specId: "7cf20107-a38a-4db6-a9bd-7cd2778f543e"
generation: 2
status: "active"
type: "capability"
category: "feature"
tags: ["tanstack-query", "server-state", "cache", "trpc"]
source: "spekn-export"
---

# TanStack Query Integration

## Full Specification

# TanStack Query Integration

**Generation**: 1

## Overview

The `@sinuxjs/tanstack-query` package bridges Sinux stores with TanStack Query's caching layer. Query and mutation operations are expressed as signal handlers, which the `tanstackQuery` middleware intercepts to delegate to `QueryClient`. Cache-to-store synchronization is bidirectional: store updates flow to the cache, and cache invalidations flow back to the store. A tRPC adapter auto-generates signals from procedure definitions.

## Spec Anchors

### #tanstack.query.signal

**User Story**: As a developer, I need to express data fetching as a store signal so that server state integrates with my Sinux state flow.

**Acceptance Criteria**:

- [ ] `querySignal(opts)` returns a handler function with `QUERY_SIGNAL` metadata attached
- [ ] `queryKey` accepts a static array or a function of signal args
- [ ] `queryFn` is called to fetch data when the signal dispatches
- [ ] `mapToState(data, state)` maps query result to partial store state
- [ ] `onFetch(state, ...args)` returns interim state before fetch
- [ ] `onError(error, state, ...args)` handles fetch failures with partial state
- [ ] `select(data)` transforms data before `mapToState`

**Constraints**: Without the `tanstackQuery` middleware installed, `querySignal` falls back to direct `queryFn` execution. `staleTime` and `gcTime` options are passed through to `QueryClient.fetchQuery`.

**Dependencies**: #core.signal.dispatch

**Technical Context**: Implemented in `packages/tanstack-query/src/query-signal.ts`. Metadata attached via `Object.defineProperty(handler, QUERY_SIGNAL, { value: opts })`. Types in `packages/tanstack-query/src/types.ts`.

### #tanstack.mutation.signal

**User Story**: As a developer, I need optimistic mutations so that the UI responds immediately while the server confirms the change.

**Acceptance Criteria**:

- [ ] `mutationSignal(opts)` returns a handler function with `MUTATION_SIGNAL` metadata
- [ ] `mutationFn(...args)` executes the server mutation
- [ ] `optimistic(state, ...args)` applies immediate state before server response
- [ ] On mutation error, store and query cache roll back to pre-optimistic state
- [ ] `invalidates` array of queryKeys are invalidated after successful mutation
- [ ] `awaitInvalidation: true` makes the signal wait for invalidation to complete

**Constraints**: Rollback must restore both store state and query cache entries. The `mapToState(data, state)` callback receives the server response to produce the final state.

**Dependencies**: #core.signal.dispatch

**Technical Context**: Implemented in `packages/tanstack-query/src/mutation-signal.ts`. Optimistic rollback snapshots `store.getState()` and relevant cache entries before mutation.

### #tanstack.middleware.dispatch

**User Story**: As a developer, I need the middleware to transparently route query/mutation signals through QueryClient so that I get caching and deduplication for free.

**Acceptance Criteria**:

- [ ] `tanstackQuery({ queryClient })` returns a `MiddlewareConfig<T>`
- [ ] `onInit` scans store signals for `QUERY_SIGNAL` metadata and sets up cache sync
- [ ] `onDispatch` intercepts query signals and calls `queryClient.fetchQuery()`
- [ ] `onDispatch` intercepts mutation signals and calls `mutationFn` directly
- [ ] Cache sync uses a counter (`syncCount`) to prevent infinite update loops
- [ ] `queryClient` option accepts a `QueryClient` instance or a factory function

**Constraints**: Cache sync subscribes to `QueryCache` events matching the signal's `queryKey`. Sync counter increments before store update and decrements after, blocking re-entrant syncs.

**Dependencies**: #core.middleware.pipeline

**Technical Context**: Implemented in `packages/tanstack-query/src/middleware.ts`. Cache sync in `packages/tanstack-query/src/cache-sync.ts`. Uses `queryCache.subscribe()` to watch for cache success events.

### #tanstack.trpc.adapter

**User Story**: As a developer using tRPC, I need to generate Sinux signals from procedure definitions so that I avoid writing boilerplate query/mutation signal config.

**Acceptance Criteria**:

- [ ] `fromTRPC(trpcClient, procedures)` returns a signal definitions object for `createStore`
- [ ] Each procedure config specifies `procedure`, `type` (query/mutation), and `mapToState`
- [ ] Query procedures produce `querySignal` handlers; mutations produce `mutationSignal` handlers
- [ ] Dot-path procedure names resolve via nested property access on tRPC client

**Constraints**: The tRPC client must expose `.query()` or `.mutate()` methods at the resolved path. Optional fields pass through to the underlying signal factory.

**Dependencies**: #tanstack.query.signal, #tanstack.mutation.signal

**Technical Context**: Implemented in `packages/tanstack-query/src/trpc/from-trpc.ts`. Procedure path resolution uses `path.split('.').reduce()` on the tRPC client.

## Global Constraints

- Peer dependencies: `@sinuxjs/core@>=1.0.0`, `@tanstack/react-query@>=5`
- React peer dependency is optional (only needed for `useQuerySignal` hook)
- Three entry points: main (`index.ts`), `/react`, `/trpc`

## Spekn Tracking Rules

- Treat this document as locked context; do not reinterpret requirements outside Spekn flow.
- Review `../decisions/INDEX.md` before implementation and whenever scope changes.
- If implementation conflicts with this spec or approved decisions, stop and escalate for a Spekn decision update.

## Related Decisions

- Shorthand index: [Approved Decisions](../decisions/INDEX.md)
