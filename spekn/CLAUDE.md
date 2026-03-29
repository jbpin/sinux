# sinux

> Generated: 2026-03-28T22:53:54.829Z
> Generation: —
> Anchors included: 19
> Type: mixed

Auto-generated from Spekn specifications.

## Test Commands

**Run tests**:
```bash
yarn test
```

**Test (watch)**:
```bash
yarn test:watch
```

## Module Map

- `packages/apollo` — apollo
- `packages/core` — core
- `packages/docs` — docs
- `packages/react` — react
- `packages/tanstack-query` — tanstack-query
- `plugins/sinux-plugin` — sinux-plugin

## Known Issues

Check project specifications and decision records for known constraints and workarounds.

## Specification Loading

Spec files under `./spekn/context/specs/` use YAML frontmatter (`---` delimiters) with structured metadata:

```yaml
title: "Feature Title"
type: capability | intent | architectural | workflow | operational | decision
generation: 1
status: draft | review | locked | archived
tags: [auth, api, ...]
anchors: [auth.login.requirements, ...]
hints:
  constraints: ["...", ...]
  requirements: ["...", ...]
```

When loading context for a task:
1. Scan spec files and read their frontmatter first (cheap — just the YAML header)
2. Filter by `type`, `tags`, or `anchors` relevant to your current task
3. Load full content only for matched specs — skip archived or unrelated ones
4. Use `hints.constraints` and `hints.requirements` from frontmatter as a summary when full content is not needed
5. Spec type determines reading depth:
   - `capability` → focus on anchors and acceptance criteria
   - `architectural` → focus on constraints and enforcement level
   - `workflow` → focus on phase gates and required artifacts
   - `operational` → focus on performance targets and compliance

## Context Priority

Sections below are ordered by priority. Under token pressure, drop from bottom up:
1. **Constraints** — Non-negotiable. Never skip.
2. **Requirements** — Acceptance criteria and success conditions.
3. **Technical Context** — Architecture decisions and integration contracts.
4. **Guidance** — Patterns and recommendations. Drop first.


## Constraints
- Middleware compose in reverse order (onion model)
- onDispatch must call next() to continue chain
- onStateChange must not trigger infinite loops
- Sinux is NOT a global state replacement for React context or server components
- Sinux is NOT a competitor to full frameworks like Next.js or Remix
- Sinux is NOT a low-level primitive library like Jotai/Valtio (atoms/proxies)
- Sinux is NOT an opinionated full-stack solution
- Anonymous mutations make debugging hard; named signals solve this by design
- Plugin must be installable with 2 commands max (git clone + claude install)
- marketplace.json must stay in sync with plugin.json version
- Skills must pass agentskills.io SKILL.md validation
- Installation must not require npm publish (git-based distribution)
- Reference API files must reflect current published package APIs

### Constraint 1
- - Middleware `onDispatch` hooks must call `next()` to pass control to the next middleware; omitting `next()` short-circuits the chain

### Constraint 2
- - `onStateChange` receives `(state, prevState, signalName)` and must not dispatch signals that trigger infinite loops

### Constraint 3
- **Technical Context**: Implemented in `packages/core/src/middlewares/persist.ts`. Options: `key` (required), `storage`, `version`, `migrate`.

### Constraint 4
- - Custom middlewares must implement `MiddlewareConfig<T>` with at least one hook

### Constraint 5
- **Constraints**: The mission statement must not be changed without updating all downstream specs that reference it. Any revision requires consensus among active maintainers.

### Constraint 6
- 1. **Traceability First** — Every state change must be named and observable. Signal names appear in DevTools, logs, and error traces. If a mutation can't be traced back to a named signal, the design is wrong.

### Constraint 7
- 4. **Minimal API Surface** — Resist feature creep. The core should remain small enough that a developer can learn the full API in an afternoon. Every addition must justify its weight.

### Constraint 8
- **Constraints**: The `.claude-plugin/` directory name and `plugin.json` file are required by the Claude Code plugin system. Do not rename or relocate them.

### Constraint 9
- **Technical Context**: `plugin.json` currently contains `{ name: "sinux-plugin", description: "...", version: "1.0.0" }`. The version field must track marketplace.json.

### Constraint 10
- - [ ] SKILL.md frontmatter includes all required fields: `name`, `description`, `license`, `allowed-tools`, `metadata.author`, `metadata.version`

### Constraint 11
- - [ ] SKILL.md passes agentskills.io validation for required fields

### Constraint 12
- **Required Frontmatter**:

**Prohibited alternatives** (derived from constraints above):
- Do NOT use vue, angular, svelte, solid, preact or other alternatives to react


## Requirements

- Three hook points: onInit, onDispatch, onStateChange
- Built-in middlewares: persist, devtools, immer
- Custom middleware via MiddlewareConfig interface
- Growing npm downloads and GitHub stars as adoption indicators
- Adoption by teams in production applications
- Comprehensive documentation and learning resources
- Community contributions and ecosystem plugins
- Support React developers building medium-to-large applications
- Support teams migrating from Redux who want reduced boilerplate
- Support developers who need integrated client and server state
- Support solo developers wanting lightweight but structured state
- Plugin directory follows .claude-plugin/plugin.json + skills/ layout
- SKILL.md frontmatter includes name, description, license, allowed-tools, metadata
- Six reference files: core-api, react-api, middleware-api, apollo-api, tanstack-query-api, patterns
- Trigger conditions define when the skill activates in Claude Code
- Version sync process keeps plugin.json, marketplace.json, and packages aligned
- marketplace.json provides registry metadata for discovery
- Git-based install flow: clone repo then claude install from plugin dir
### Project Context

- [Core Middleware System](./spekn/context/specs/core-middleware-system-2e43feed.md)
- [Sinux Product Intent & Goals](./spekn/context/specs/sinux-product-intent-goals-c8e4be78.md)

## Technical Context
- Array.reduceRight for dispatch chain composition
- persist uses localStorage or custom SinuxStorage
- devtools integrates with Redux DevTools Extension
- Named signals: every mutation is traceable and composable by design
- First-class async with command pipeline (.add()) requires no middleware
- Built-in server state adapters (TanStack Query, Apollo) in same mental model
- Middleware system with onInit, onDispatch, onStateChange hooks
- Redux DevTools integration for full traceability
- TypeScript-first with strong type inference
- Plugin root: plugins/sinux-plugin/
- Skill root: plugins/sinux-plugin/skills/sinux/
- plugin.json fields: name, description, version
- SKILL.md allowed-tools restricts skill to Read-only by default
- **Middleware Onion Composition Model**: The onion model provides predictable execution order matching developer expectations from Express/Koa middleware. Reverse composition ensures the first middleware listed has the widest scope (sees all dispatches first), which aligns with the convention that high-priority concerns (logging, auth) are listed first.

- MUST review `./spekn/context/decisions/INDEX.md` before implementation and keep decision context aligned.

## Guidance
- Middleware order in array matters for dispatch interception
- Documentation and developer onboarding are the top priority
- Community building and adoption are the second priority
- Resist feature creep: keep the core API surface minimal
- Design principles: traceability first, async by default, composability over config
- Reference files are the skill's knowledge base — keep them accurate and concise
- SKILL.md description is the primary discovery mechanism in Claude Code
- Marketplace is git-based, not registry-based — simplicity over infrastructure
- **Middleware Onion Composition Model**: Middlewares compose in reverse array order using Array.reduceRight, creating an onion model where the first middleware in the array is the outermost wrapper. Each middleware's onDispatch can intercept, transform, or delegate via next().

## Spekn Tracking Protocol
- Keep decision context active from start to finish; avoid stale decision state.
- If MCP is available, refresh context using `spekn_spec_search`, `spekn_context_bundle_get`, `spekn_decision_fetch_scope`, `spekn_decision_fetch_chain`, and `spekn_experience_search`.
- If MCP is unavailable, rely on `./spekn/context/specs/*` and `./spekn/context/decisions/INDEX.md`.
- Escalate conflicts between implementation, specs, and approved decisions.

## Enforcement Rules

### Acceptance Criteria Verification
- Every acceptance criterion listed above is a hard requirement — do NOT mark work as complete until each one is verified.
- For each criterion, provide specific evidence: test output, file:line reference, or command result.
- Do NOT use vague completion claims like "should work", "seems correct", or "looks good" — state what was verified and how.

### Constraint Compliance
- Constraints listed above are non-negotiable. If a constraint conflicts with your implementation approach, escalate — do NOT silently deviate.
- If you find yourself rationalizing why a constraint doesn't apply to your case, stop and re-read it.
