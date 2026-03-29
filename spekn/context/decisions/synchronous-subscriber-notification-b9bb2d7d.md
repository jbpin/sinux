---
title: "Synchronous Subscriber Notification"
type: "decision"
status: "approved"
decisionId: "b9bb2d7d-f4b9-4a42-9d5f-7a51fe42ec54"
specId: "c01c80cc-6dca-4f2a-aefb-0f7e033b5e07"
specTitle: "Core Store and Signals"
specAnchor: "core.store.lifecycle"
createdAt: "2026-03-28"
decidedAt: "2026-03-28"
source: "spekn-export"
---

# Synchronous Subscriber Notification

## Summary

Store subscribers are notified synchronously during updateState() rather than asynchronously or batched. This is required for compatibility with React's useSyncExternalStore hook, which demands that the snapshot is fresh at subscription notification time.

## Rationale

React's useSyncExternalStore requires that the snapshot returned by getSnapshot() reflects the latest state at the moment subscribers are notified. Asynchronous notification would cause tearing in concurrent rendering mode. Synchronous notification ensures the store and React's internal state are always consistent.

## Spekn Tracking Rules

- Apply this decision as authoritative for implementation behavior.
- Keep this decision aligned with its related spec and acceptance criteria.
- If this decision appears outdated or conflicting, escalate through Spekn decision workflow.

## Anchor

- `core.store.lifecycle`

## Related Spec

- [Core Store and Signals](../specs/core-store-and-signals-c01c80cc.md)
