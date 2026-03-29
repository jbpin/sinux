---
title: "Metadata Attachment Pattern for Integration Packages"
type: "decision"
status: "approved"
decisionId: "f4938bf9-efb5-40f3-a1ea-2486b30dcb60"
specId: "7cf20107-a38a-4db6-a9bd-7cd2778f543e"
specTitle: "TanStack Query Integration"
specAnchor: "tanstack.middleware.dispatch"
createdAt: "2026-03-28"
decidedAt: "2026-03-28"
source: "spekn-export"
---

# Metadata Attachment Pattern for Integration Packages

## Summary

Integration packages (tanstack-query, apollo) attach invisible metadata to signal handlers using Object.defineProperty with non-enumerable symbol keys (QUERY_SIGNAL, MUTATION_SIGNAL, GRAPHQL_QUERY, GRAPHQL_MUTATION). Middleware detects these symbols at dispatch time to route signals through the appropriate client.

## Rationale

This pattern allows signal handlers to carry integration-specific configuration without polluting the handler's public API or requiring a separate registry. Middleware can detect handler type at dispatch time with zero coupling to the handler's signature. Non-enumerable properties prevent interference with serialization or iteration.

## Spekn Tracking Rules

- Apply this decision as authoritative for implementation behavior.
- Keep this decision aligned with its related spec and acceptance criteria.
- If this decision appears outdated or conflicting, escalate through Spekn decision workflow.

## Anchor

- `tanstack.middleware.dispatch`

## Related Spec

- [TanStack Query Integration](../specs/tanstack-query-integration-7cf20107.md)
