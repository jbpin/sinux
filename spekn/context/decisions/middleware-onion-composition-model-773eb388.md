---
title: "Middleware Onion Composition Model"
type: "decision"
status: "approved"
decisionId: "773eb388-60e8-40ef-81ef-6cdbc013eaf0"
specId: "2e43feed-b981-42ca-8962-e06e155e164e"
specTitle: "Core Middleware System"
specAnchor: "core.middleware.pipeline"
createdAt: "2026-03-28"
decidedAt: "2026-03-28"
source: "spekn-export"
---

# Middleware Onion Composition Model

## Summary

Middlewares compose in reverse array order using Array.reduceRight, creating an onion model where the first middleware in the array is the outermost wrapper. Each middleware's onDispatch can intercept, transform, or delegate via next().

## Rationale

The onion model provides predictable execution order matching developer expectations from Express/Koa middleware. Reverse composition ensures the first middleware listed has the widest scope (sees all dispatches first), which aligns with the convention that high-priority concerns (logging, auth) are listed first.

## Spekn Tracking Rules

- Apply this decision as authoritative for implementation behavior.
- Keep this decision aligned with its related spec and acceptance criteria.
- If this decision appears outdated or conflicting, escalate through Spekn decision workflow.

## Anchor

- `core.middleware.pipeline`

## Related Spec

- [Core Middleware System](../specs/core-middleware-system-2e43feed.md)
