---
title: "React Integration"
specId: "e91966f4-e863-43dd-ad04-f4b6aa858a23"
generation: 1
status: "active"
type: "capability"
category: "feature"
tags: ["react", "hooks", "combine", "multi-store"]
source: "spekn-export"
---

# React Integration

## Full Specification

# React Integration

## Overview

The `@sinuxjs/react` package provides React hooks for subscribing to Sinux stores and computed values. It uses `useSyncExternalStore` (with a shim for React 16-17) to ensure tear-free reads during concurrent rendering. The `combine` utility merges multiple stores into a single subscription target for multi-store components.

## Spec Anchors

### #react.hooks.usestore

**User Story**: As a React developer, I need a hook to subscribe to store state so that my component re-renders when relevant state changes.

**Acceptance Criteria**:

- [ ] `useStore(store)` returns `store.state` typed as the store's complete `State` generic parameter
- [ ] `useStore(store, selector)` returns only the selected slice
- [ ] `useStore(store, selector, equalityFn)` uses custom equality to prevent re-renders
- [ ] Component re-renders only when `equalityFn(prevSelected, nextSelected)` returns `false` (default: `Object.is`)
- [ ] Hook uses `use-sync-external-store` shim when `React.useSyncExternalStore` is undefined (React 16.8–17)
- [ ] `useStores(combinedStore, selector?)` subscribes to a combined multi-store

**Constraints**: Snapshot must be returned synchronously from `store.state`. Subscribe callback must be synchronous per React's `useSyncExternalStore` contract. Default equality uses `Object.is`.

**Dependencies**: #core.store.lifecycle

**Technical Context**: Implemented in `packages/react/src/useStore.ts`. Uses `useSyncExternalStoreWithSelector` from `use-sync-external-store/with-selector`. Types in `packages/react/src/types.ts`.

### #react.hooks.usecomputed

**User Story**: As a React developer, I need a hook for computed values so that I can render derived state without manual subscription.

**Acceptance Criteria**:

- [ ] `useComputed(computedValue)` returns the value from `computedValue.get()` at render time
- [ ] Component re-renders only when `Object.is(prevValue, nextValue)` returns `false` for successive `computedValue.get()` snapshots
- [ ] Accepts any `ComputedValue` instance, whether created via `computed()` or `computedFrom()`

**Constraints**: Must use `useSyncExternalStore` with `computedValue.get` as snapshot and `computedValue.subscribe` for subscription.

**Dependencies**: #core.computed.derivation

**Technical Context**: Implemented in `packages/react/src/useComputed.ts`. Wraps `useSyncExternalStore(computedValue.subscribe, computedValue.get, computedValue.get)`.

### #react.combine.multistore

**User Story**: As a React developer, I need to subscribe to state from 2+ stores in a single component so that I avoid prop drilling across store boundaries.

**Acceptance Criteria**:

- [ ] `combine(storeA, storeB, ...)` returns a `CombinedStore` with merged state type
- [ ] `CombinedStore.state` is a getter that recomputes merged state on access
- [ ] Subscription callback fires when any underlying store emits a `subscribe` notification
- [ ] Unsubscribe removes listeners from all underlying stores
- [ ] `CombinedStore.state` returns the latest merged state when read inside a subscription callback or during render

**Constraints**: Combined state is the intersection of all store state types. Subscription and snapshot must satisfy `useSyncExternalStore` synchronous contract.

**Dependencies**: #core.store.lifecycle

**Technical Context**: Implemented in `packages/react/src/index.ts` (combine function). Type mapping uses `TupleToIntersection` and `CombineStates` from `packages/react/src/types.ts`. Tests in `test/combine.test.ts`.

## Global Constraints

- Peer dependency on `react@>=16.8` and `@sinuxjs/core`
- Runtime dependency on `use-sync-external-store@1.2.0` for React 16-17 shim
- All exports from `packages/react/src/index.ts`

## Spekn Tracking Rules

- Treat this document as locked context; do not reinterpret requirements outside Spekn flow.
- Review `../decisions/INDEX.md` before implementation and whenever scope changes.
- If implementation conflicts with this spec or approved decisions, stop and escalate for a Spekn decision update.

## Related Decisions

- Shorthand index: [Approved Decisions](../decisions/INDEX.md)
