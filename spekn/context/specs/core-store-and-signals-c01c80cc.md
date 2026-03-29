---
title: "Core Store and Signals"
specId: "c01c80cc-6dca-4f2a-aefb-0f7e033b5e07"
generation: 1
status: "active"
type: "capability"
category: "feature"
tags: ["core", "store", "signal", "state-management"]
source: "spekn-export"
---

# Core Store and Signals

## Full Specification

# Core Store and Signals

**Generation**: 2

## Overview

The core package (`@sinuxjs/core`) provides the foundation of Sinux: reactive stores that hold state, and named signals that update it. Stores notify subscribers synchronously on state change. Signals support async handlers, generators, and handler stacking via `.add()`. The `createStore` factory wires signal definitions and middleware into a typed store instance. Computed values derive memoized state from one or many stores.

## Spec Anchors

### #core.store.lifecycle

**User Story**: As a developer, I need a reactive state container so that my UI re-renders when application state changes.

**Acceptance Criteria**:

- [ ] `new Store(initialState)` creates a store with the given initial state
- [ ] `store.getState()` returns a shallow copy of current state
- [ ] `store.updateState(partial)` merges partial into state and notifies subscribers
- [ ] `store.updateState()` with no actual state change does not fire notifications
- [ ] `store.subscribe(cb)` returns an unsubscribe function
- [ ] `store.resetStore()` restores initial state and notifies subscribers
- [ ] `store.changed` is a built-in Signal fired after state updates

**Constraints**: Subscribers must be notified synchronously during `updateState` to satisfy React `useSyncExternalStore` contract. Shallow equality check uses `Object.keys` comparison.

**Technical Context**: Implemented in `packages/core/src/store.ts`. Uses `shallowEqual` from `packages/core/src/utils.ts`. The `changed` signal is created in constructor and dispatched in `updateState`.

### #core.signal.dispatch

**User Story**: As a developer, I need named async commands so that every state mutation is traceable and composable.

**Acceptance Criteria**:

- [ ] `signal.dispatch(...args)` executes all registered handlers in sequence
- [ ] Handlers can return `Partial<T>`, `Promise<Partial<T>>`, or a generator yielding promises
- [ ] Multiple handlers on the same signal compose their results via object spread or array concat
- [ ] `signal.add(handler)` registers a new handler to the signal command set
- [ ] `signal.remove(handler)` unregisters a handler
- [ ] Dispatch returns a Promise that resolves with the composed result

**Constraints**: Handler execution order follows insertion order. Generator handlers yield promises that are awaited sequentially. Result merging uses `Object.assign` for objects, `concat` for arrays.

**Technical Context**: Implemented in `packages/core/src/signal.ts`. The Signal class holds a `Set<Function>` of commands. Dispatch iterates commands, detects generators via `Symbol.iterator`, and merges results.

### #core.store.createstore

**User Story**: As a developer, I need a factory function so that I can declare a store with typed signals and middleware in a single call.

**Acceptance Criteria**:

- [ ] `createStore(initialState, signals, middlewares)` returns a Store with signal methods attached
- [ ] Each signal definition `(state, ...args) => Partial<T>` becomes a callable method on the store
- [ ] Calling `store.signalName(...args)` dispatches through the middleware chain
- [ ] Middleware `onInit` hooks run after store creation
- [ ] Middleware `onDispatch` hooks wrap signal dispatch in reverse array order (onion model)
- [ ] TypeScript infers signal argument types from the signal definition

**Constraints**: Signal methods on the store return `Promise<Partial<T>>`. Middleware composition uses `Array.reduceRight` to build the dispatch chain.

**Technical Context**: Implemented in `packages/core/src/store.ts` (createStore function). Type inference uses `TransformArgumentsToSignalInstances<T, U>` from `packages/core/src/types.ts`.

### #core.computed.derivation

**User Story**: As a developer, I need derived state values so that I can compute projections without duplicating state.

**Acceptance Criteria**:

- [ ] `computed(store, deriveFn)` returns a `ComputedValue<R>` with `get()` and `subscribe()`
- [ ] Computed values are memoized; `get()` returns cached result if store state unchanged
- [ ] Subscribers are notified only when the derived value changes (`Object.is` equality)
- [ ] `computedFrom(stores[], deriveFn)` combines state from 2+ stores into a single derived value

**Constraints**: Computed values must support the `useSyncExternalStore` subscription model (synchronous `get`, synchronous subscribe callback).

**Technical Context**: Implemented in `packages/core/src/computed.ts`. Both `computed` and `computedFrom` subscribe to the underlying store(s) and cache results.

## Global Constraints

- The core package has zero runtime dependencies
- All public APIs are exported from `packages/core/src/index.ts`
- State objects are treated as immutable; `getState()` returns a shallow copy

## Spekn Tracking Rules

- Treat this document as locked context; do not reinterpret requirements outside Spekn flow.
- Review `../decisions/INDEX.md` before implementation and whenever scope changes.
- If implementation conflicts with this spec or approved decisions, stop and escalate for a Spekn decision update.

## Related Decisions

- Shorthand index: [Approved Decisions](../decisions/INDEX.md)
