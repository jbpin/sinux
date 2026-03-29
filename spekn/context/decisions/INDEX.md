---
title: "Approved Decisions (Shorthand)"
type: "decision-index"
status: "approved"
decisionCount: 3
source: "spekn-export"
---

# Approved Decisions (Shorthand)

## Usage

- Read this index fully before implementation work.
- Open each linked decision document relevant to your task scope.
- Keep this index as active decision context while coding.

- [Synchronous Subscriber Notification](./spekn/context/decisions/synchronous-subscriber-notification-b9bb2d7d.md) (2026-03-28)
  - anchor: `core.store.lifecycle`
  - rationale: React's useSyncExternalStore requires that the snapshot returned by getSnapshot() reflects the latest state at the moment subscribers are notified. Asynchronous
- [Metadata Attachment Pattern for Integration Packages](./spekn/context/decisions/metadata-attachment-pattern-for-integration-packages-f4938bf9.md) (2026-03-28)
  - anchor: `tanstack.middleware.dispatch`
  - rationale: This pattern allows signal handlers to carry integration-specific configuration without polluting the handler's public API or requiring a separate registry. Mid
- [Middleware Onion Composition Model](./spekn/context/decisions/middleware-onion-composition-model-773eb388.md) (2026-03-28)
  - anchor: `core.middleware.pipeline`
  - rationale: The onion model provides predictable execution order matching developer expectations from Express/Koa middleware. Reverse composition ensures the first middlewa
