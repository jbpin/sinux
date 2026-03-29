---
title: "Sinux Product Intent & Goals"
specId: "c8e4be78-870b-4e25-820c-76fc3d3f462f"
generation: 1
status: "active"
type: "intent"
category: "context"
tags: ["state-management", "signals", "flux", "typescript", "devtools", "open-source"]
source: "spekn-export"
---

# Sinux Product Intent & Goals

## Full Specification

## Overview

Sinux is a signal-driven state management library for React that leverages named signals to make every state mutation predictable, traceable, and composable. Built on Flux architecture principles, it provides first-class async support, a command pipeline, and integrated server state adapters — offering a complete yet focused alternative to existing solutions.

This intent spec defines the product vision, target audience, competitive positioning, design principles, and success criteria that guide all Sinux development.

---

### #vision.mission.purpose

**User Story**: As a Sinux maintainer, I need a clear product mission so that all development decisions align with a shared north star.

**Acceptance Criteria**:
- [ ] Mission statement is concise and actionable
- [ ] Mission clearly communicates the core value proposition
- [ ] Mission differentiates Sinux from alternatives

**Mission Statement**: Sinux is a state management library that leverages named signals to make React state predictable, traceable, and composable — without sacrificing developer ergonomics.

**Long-Term Vision**: Become the go-to state management solution for teams that value traceability and DevTools integration, offering a complete client + server state management experience in a single, coherent mental model.

**Core Problems Solved**:
- Anonymous mutations (e.g., Zustand's `set()`) make debugging hard in production — Sinux's named signals ensure every state change is identifiable
- Async state management in Redux requires additional libraries (Saga, Thunk) — Sinux signals are async by default with native Promise support
- Server state (TanStack Query, Apollo) typically lives in a separate paradigm — Sinux bridges client and server state under the same signal-driven model

**Constraints**: The mission statement must not be changed without updating all downstream specs that reference it. Any revision requires consensus among active maintainers.

**Dependencies**: None — this is the foundational spec.

**Technical Context**: Sinux v2.0.4 is published and stable across 4 packages (@sinuxjs/core, @sinuxjs/react, @sinuxjs/tanstack-query, @sinuxjs/apollo).

---

### #vision.principles.design

**User Story**: As a Sinux contributor, I need documented design principles so that I can make architectural decisions consistent with the project's philosophy.

**Acceptance Criteria**:
- [ ] Each principle is stated clearly with rationale
- [ ] Principles are ordered by priority
- [ ] Principles are actionable (can resolve design trade-offs)

**Design Principles** (in priority order):

1. **Traceability First** — Every state change must be named and observable. Signal names appear in DevTools, logs, and error traces. If a mutation can't be traced back to a named signal, the design is wrong.

2. **Async Is Not an Afterthought** — Signals are async by default. Handlers return `Partial<T> | Promise<Partial<T>>`. No thunks, no sagas, no extra middleware. Async is the baseline, not an extension.

3. **Composability Over Configuration** — The `.add()` pipeline lets two or more handlers stack sequentially on a single signal. Middleware hooks (`onInit`, `onDispatch`, `onStateChange`) compose orthogonally. Prefer composable primitives over configuration options.

4. **Minimal API Surface** — Resist feature creep. The core should remain small enough that a developer can learn the full API in an afternoon. Every addition must justify its weight.

**Constraints**: These principles apply to all packages in the @sinuxjs scope. When principles conflict, higher-priority principles win.

**Dependencies**: None.

**Technical Context**: These principles emerged from the evolution of Sinux from v0.x (experimental) through v2.0 (stable release) and reflect lessons learned from production usage.

---

### #vision.principles.nongoals

**User Story**: As a developer evaluating Sinux, I need to understand what Sinux is NOT so that I can make an informed adoption decision.

**Acceptance Criteria**:
- [ ] Non-goals are explicitly stated
- [ ] Each non-goal explains why it's excluded
- [ ] Non-goals help potential users self-select

**Explicit Non-Goals**:

- **Not a global state replacement for React context or server components** — Sinux manages application state through stores. React's built-in mechanisms (context, server components) serve different purposes and Sinux does not attempt to replace them.

- **Not a competitor to full frameworks** — Sinux is a state management library, not a framework like Next.js or Remix. It integrates with frameworks rather than competing with them.

- **Not a low-level primitive library** — Unlike Jotai (atoms) or Valtio (proxies), Sinux operates at the store level with named signals. It is opinionated about structure (Flux) while remaining adaptable across application sizes.

- **Not an opinionated full-stack solution** — Sinux provides adapters for server state (TanStack Query, Apollo) but does not prescribe how to build your backend, API layer, or data model.

**Constraints**: These non-goals should be referenced when evaluating feature requests to prevent scope creep.

**Dependencies**: None.

**Technical Context**: Defining non-goals is critical for an open-source library to maintain focus and set correct expectations.

---

### #audience.primary.segments

**User Story**: As a Sinux maintainer, I need to understand my target audience segments so that documentation, features, and messaging are tailored to their needs.

**Acceptance Criteria**:
- [ ] Each segment is described with context and needs
- [ ] Segments are prioritized
- [ ] Adoption path is identified for each segment

**Target Audience Segments** (in priority order):

1. **React developers building medium-to-large applications** — Need structured, predictable state management. Value DevTools integration and traceability for debugging. Adoption path: getting started guide → store patterns → middleware.

2. **Teams migrating from Redux** — Want reduced boilerplate and fewer abstractions without losing Flux structure. Familiar with Flux concepts. Adoption path: migration guide showing Redux → Sinux equivalents, emphasizing reduced boilerplate.

3. **Developers needing integrated client + server state** — Currently juggling TanStack Query or Apollo alongside a separate state library. Adoption path: server state integration guides showing unified signal-driven approach.

4. **Solo developers and small teams** — Want lightweight but structured state management. Don't want to "outgrow" their state solution. Adoption path: quick start → examples showing how Sinux scales from a single store to multi-store architectures.

**Constraints**: Documentation and API design decisions should prioritize segment 1 (largest audience) while remaining accessible to all segments.

**Dependencies**: None.

**Technical Context**: These segments were identified based on the React state management landscape and Sinux's competitive positioning.

---

### #audience.positioning.differentiation

**User Story**: As a developer comparing state management libraries, I need to understand how Sinux differentiates itself so that I can choose the right tool.

**Acceptance Criteria**:
- [ ] Key differentiators are clearly stated
- [ ] Comparison with main alternatives is honest and specific
- [ ] The "why choose Sinux" argument is compelling

**Key Differentiator**: The combination of named signals (traceability), first-class async (no extra middleware), command pipeline (.add()), and built-in server state adapters — delivered as a cohesive, focused package.

**Competitive Positioning**:

| Aspect | Sinux | Zustand | Redux Toolkit | Jotai |
|--------|-------|---------|---------------|-------|
| Mutations | Named signals | Anonymous `set()` | Named actions + reducers | Atom writes |
| Async | First-class (Promise/generator) | Convention-based | Thunks/RTK Query | Async atoms |
| Pipeline | `.add()` composition | Not built-in | Middleware chain | Derived atoms |
| Server state | Built-in adapters | Separate wiring | RTK Query (coupled) | Separate |
| DevTools | Redux DevTools native | Redux DevTools adapter | Redux DevTools native | Custom |
| Bundle size | Small (~4KB core) | Minimal (~1KB) | Larger (~12KB) | Small (~3KB) |
| Learning curve | Moderate (Flux concepts) | Low | Moderate-High | Low-Moderate |

**Why Choose Sinux**: When you need every state mutation to have a name, async to work without ceremony, and server state to live in the same mental model as client state — without the weight of Redux.

**Constraints**: Positioning should be updated as the competitive landscape evolves.

**Dependencies**: None.

**Technical Context**: Sinux's unique combination of features occupies a specific niche — more structured than Zustand, lighter than Redux, higher-level than Jotai.

---

### #goals.adoption.metrics

**User Story**: As a Sinux maintainer, I need measurable success criteria so that I can track progress and make data-informed decisions.

**Acceptance Criteria**:
- [ ] Metrics are specific and measurable
- [ ] Targets are realistic for a 12-month horizon
- [ ] Metrics cover both quantitative and qualitative signals

**Success Metrics (12-month horizon)**:

| Metric | Current Baseline | Target | How to Measure |
|--------|-----------------|--------|----------------|
| npm weekly downloads | Establish baseline | Consistent growth trend | npm stats |
| GitHub stars | Current count | 2x current | GitHub |
| Production adoption | Unknown | 3+ teams using in production | User reports, case studies |
| Documentation coverage | Partial | All APIs documented with examples | Documentation audit |
| Community contributions | Minimal | 5+ external PRs merged | GitHub insights |
| Open issues resolution | N/A | < 2 week average response time | GitHub issues |

**Qualitative Signals**:
- Positive mentions in React state management discussions
- Conference talks or blog posts referencing Sinux
- Ecosystem plugins built by community members

**Constraints**: Metrics should be reviewed quarterly and adjusted based on trends.

**Dependencies**: None.

**Technical Context**: As an open-source project, adoption metrics serve as the primary indicator of product-market fit.

---

### #goals.priorities.roadmap

**User Story**: As a Sinux contributor, I need to know current priorities so that I can focus efforts on what matters most.

**Acceptance Criteria**:
- [ ] Priorities are ranked
- [ ] Each priority has a rationale
- [ ] Priorities align with the product mission and success metrics

**Current Priorities** (ranked):

1. **Documentation and Developer Onboarding** — The biggest barrier to adoption is not features but discoverability and learning curve. Invest in getting-started guides, interactive examples, and API reference completeness.

2. **Community Building and Adoption** — Create pathways for developers to discover, try, and adopt Sinux. This includes social presence, blog posts, comparison guides, and migration paths from popular alternatives.

3. **API Stability and Reliability** — Maintain backwards compatibility in the v2.x line. Prioritize bug fixes and edge case handling over new features. Build trust through stability.

4. **Performance and Bundle Optimization** — Ensure Sinux remains competitive on bundle size and runtime performance. Benchmark against alternatives.

5. **New Integrations and Ecosystem** — Expand server state adapters and middleware options based on community demand, not speculation.

**Constraints**: Priorities 1-2 take precedence. New features (priority 5) should not be pursued at the expense of documentation and stability.

**Dependencies**: None.

**Technical Context**: These priorities reflect the project's transition from "build the product" to "grow the community."

---

### #goals.ecosystem.growth

**User Story**: As a Sinux maintainer, I need an ecosystem growth strategy so that Sinux becomes self-sustaining through community contributions and third-party integrations.

**Acceptance Criteria**:
- [ ] Ecosystem growth areas are identified
- [ ] Contribution pathways are defined
- [ ] Plugin/extension model is considered

**Ecosystem Growth Strategy**:

**Documentation & Learning**:
- Complete API reference for all 4 packages
- Interactive playground / sandbox examples
- Video tutorials and walkthroughs
- Migration guides (from Redux, Zustand)

**Community Engagement**:
- Contribution guidelines and "help wanted" / "starter" issue labeling
- Discord or GitHub Discussions for community support
- Showcase of projects built with Sinux

**Extensibility**:
- Middleware authoring guide for community-built middleware
- Server state adapter pattern documentation for custom integrations
- Plugin system exploration for future extensibility

**Partnerships**:
- Integration with popular meta-frameworks (Next.js, Remix)
- Presence in React ecosystem tooling (DevTools, ESLint plugins)

**Constraints**: Growth should be organic and community-driven. Avoid artificial growth tactics.

**Dependencies**: None.

**Technical Context**: The middleware system (`onInit`, `onDispatch`, `onStateChange`) and server state adapter pattern (`querySignal`, `mutationSignal`) already provide extension points for ecosystem growth.

## Spekn Tracking Rules

- Treat this document as locked context; do not reinterpret requirements outside Spekn flow.
- Review `../decisions/INDEX.md` before implementation and whenever scope changes.
- If implementation conflicts with this spec or approved decisions, stop and escalate for a Spekn decision update.

## Related Decisions

- Shorthand index: [Approved Decisions](../decisions/INDEX.md)
