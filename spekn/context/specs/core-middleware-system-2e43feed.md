---
title: "Core Middleware System"
specId: "2e43feed-b981-42ca-8962-e06e155e164e"
generation: 1
status: "active"
type: "architectural"
category: "context"
tags: ["core", "middleware", "architecture"]
source: "spekn-export"
---

# Core Middleware System

## Full Specification

# Core Middleware System


## Overview

The middleware system provides three lifecycle hooks for extending store behavior: `onInit` (setup after store creation), `onDispatch` (intercept and transform signal dispatch), and `onStateChange` (react to state transitions). Middlewares compose in reverse array order for dispatch, forming an onion model where the first middleware in the array is the outermost wrapper. Three built-in middlewares ship with core: persist (localStorage), devtools (Redux DevTools), and immer (mutable-style updates).

## Spec Anchors

### #core.middleware.pipeline

**Constraints**:

- Middleware `onDispatch` hooks must call `next()` to pass control to the next middleware; omitting `next()` short-circuits the chain
- `onStateChange` receives `(state, prevState, signalName)` and must not dispatch signals that trigger infinite loops
- `onInit` receives the store instance and runs after all signals are wired
- Composition order: `[mw1, mw2]` means mw1 wraps mw2 (mw1.before -> mw2.before -> handler -> mw2.after -> mw1.after)

**Technical Context**: Implemented in `packages/core/src/store.ts` within `createStore`. The `MiddlewareConfig<T>` type is defined in `packages/core/src/middleware.ts`. Dispatch chain built with `middlewares.reduceRight`.

**Acceptance Criteria**:
- Middleware `onDispatch` that omits `next()` prevents downstream middlewares and the signal handler from executing
- Middleware `onStateChange` receives correct `(state, prevState, signalName)` arguments after each state transition
- `onInit` fires once per store creation, after all signals are registered
- Composition of `[mw1, mw2]` executes in onion order: mw1.before → mw2.before → handler → mw2.after → mw1.after
- A middleware implementing only `onInit` does not interfere with dispatch or state change chains

### #core.middleware.persist

**Constraints**:

- Loads persisted state in `onInit` via `storage.getItem(key)`
- Saves state in `onStateChange` via `storage.setItem(key, JSON.stringify(state))`
- Supports version tracking and migration functions for schema evolution
- Storage interface (`SinuxStorage`) supports async `getItem`/`setItem`/`removeItem`
- Default storage: `window.localStorage`

**Technical Context**: Implemented in `packages/core/src/middlewares/persist.ts`. Options: `key` (required), `storage`, `version`, `migrate`.

**Acceptance Criteria**:
- Store state is restored from `storage.getItem(key)` during `onInit` before any signals dispatch
- Every state change persists the full state via `storage.setItem(key, JSON.stringify(state))`
- When `version` changes and `migrate` is provided, stored state is transformed through the migration function on load
- Custom `SinuxStorage` with async `getItem`/`setItem`/`removeItem` works identically to `localStorage`
- When no persisted state exists, the store initializes with its default state

### #core.middleware.devtools

**Constraints**:

- Connects to `window.__REDUX_DEVTOOLS_EXTENSION__` in `onInit`
- Sends `{ type: signalName, payload: state }` on every `onStateChange`
- Can be disabled with `enabled: false` option
- No-op when DevTools extension is not installed

**Technical Context**: Implemented in `packages/core/src/middlewares/devtools.ts`. Options: `name` (store display name), `enabled`.

**Acceptance Criteria**:
- When Redux DevTools extension is installed, the store connects during `onInit` and appears under the configured `name`
- Each state change sends `{ type: signalName, payload: state }` to DevTools
- Setting `enabled: false` prevents connection even when the extension is present
- When the DevTools extension is not installed, no errors are thrown and the store functions normally

### #core.middleware.immer

**Constraints**:

- Wraps signal command execution in Immer `produce()` in `onDispatch`
- Allows direct mutations on draft state within signal handlers
- Merges any returned object into the draft via `Object.assign`
- Requires `immer` as peer dependency (optional)

**Technical Context**: Implemented in `packages/core/src/middlewares/immer.ts`. Overrides each signal's commands to wrap them in `produce`.

**Acceptance Criteria**:
- Signal handlers can directly mutate draft state (e.g., `state.count++`) and produce a new immutable state
- Returning an object from a signal handler merges it into the draft via `Object.assign`
- Without the immer middleware, direct mutations do not affect state (baseline behavior preserved)
- When `immer` peer dependency is not installed, importing the middleware throws a clear error

## Global Constraints

- Custom middlewares must implement `MiddlewareConfig<T>` with at least one hook
- Middleware state changes during `onStateChange` should not re-trigger the same middleware
- The middleware array is processed once at store creation time; dynamic middleware addition is not supported

## Spekn Tracking Rules

- Treat this document as locked context; do not reinterpret requirements outside Spekn flow.
- Review `../decisions/INDEX.md` before implementation and whenever scope changes.
- If implementation conflicts with this spec or approved decisions, stop and escalate for a Spekn decision update.

## Related Decisions

- Shorthand index: [Approved Decisions](../decisions/INDEX.md)
