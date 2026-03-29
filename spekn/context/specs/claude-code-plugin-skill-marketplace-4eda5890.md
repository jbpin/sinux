---
title: "Claude Code Plugin, Skill & Marketplace"
specId: "4eda5890-ca3e-4f1e-b91f-0a318bcd6b0d"
generation: 1
status: "active"
type: "capability"
category: "feature"
tags: ["plugin", "skill", "claude-code", "marketplace", "devtools", "ecosystem"]
source: "spekn-export"
---

# Claude Code Plugin, Skill & Marketplace

## Full Specification

## Overview

This specification defines the Claude Code plugin and skill structure for Sinux, covering how the plugin is organized, what the skill teaches, how reference APIs are maintained, and how the plugin is distributed via git-based marketplace installation. It ensures the Sinux skill in Claude Code stays accurate, discoverable, and installable in 2 commands or fewer.

---

### #plugin.structure.layout

**User Story**: As a Sinux maintainer, I need a well-defined plugin directory structure so that the Claude Code plugin system recognizes and loads the Sinux skill correctly.

**Acceptance Criteria**:
- [ ] Plugin root lives at `plugins/sinux-plugin/`
- [ ] `.claude-plugin/plugin.json` contains valid name, description, and version fields
- [ ] `skills/sinux/` directory contains `SKILL.md` and `references/` subdirectory
- [ ] Directory structure passes `claude plugin validate` (if available)

**Directory Layout**:
```
plugins/sinux-plugin/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata (name, description, version)
└── skills/
    └── sinux/
        ├── SKILL.md          # Skill definition and teaching content
        └── references/
            ├── core-api.md
            ├── react-api.md
            ├── middleware-api.md
            ├── apollo-api.md
            ├── tanstack-query-api.md
            └── patterns.md
```

**Constraints**: The `.claude-plugin/` directory name and `plugin.json` file are required by the Claude Code plugin system. Do not rename or relocate them.

**Dependencies**: None — this is the foundational structure.

**Technical Context**: `plugin.json` currently contains `{ name: "sinux-plugin", description: "...", version: "1.0.0" }`. The version field must track marketplace.json.

---

### #plugin.skill.content

**User Story**: As a developer using Claude Code, I need the Sinux SKILL.md to teach me how to use Sinux so that Claude generates valid, idiomatic Sinux code.

**Acceptance Criteria**:
- [ ] SKILL.md frontmatter includes all required fields: `name`, `description`, `license`, `allowed-tools`, `metadata.author`, `metadata.version`
- [ ] Body covers: installation, store creation, React hooks, middleware, TanStack Query, Apollo Client
- [ ] Each section links to the appropriate reference file for deeper API details
- [ ] SKILL.md passes agentskills.io validation for required fields
- [ ] Description field is detailed enough to serve as the primary trigger/discovery text

**Required Frontmatter**:
```yaml
---
name: sinux
description: "Sinux is a signal-driven state management library..."
license: MIT
allowed-tools: Read
metadata:
  author: jbpin
  version: "2.0"
---
```

**Body Sections** (in order):
1. Install — npm install commands for core + react
2. Create a Store — `createStore` with record-style signals, handler signature
3. React — `useStore` hook with selector pattern
4. Middleware — persist, devtools, immer, custom middleware
5. TanStack Query — `querySignal` / `mutationSignal` integration
6. Apollo Client — Apollo adapter usage

**Constraints**: `allowed-tools: Read` restricts the skill to read-only operations — it teaches but does not modify user code autonomously.

**Dependencies**: `#plugin.skill.references` — body sections link to reference files.

**Technical Context**: The `description` field in frontmatter is what Claude Code uses to decide when to activate the skill. It must mention all package names (@sinuxjs/core, @sinuxjs/react, @sinuxjs/tanstack-query, @sinuxjs/apollo) and key concepts (stores, signals, middleware).

---

### #plugin.skill.references

**User Story**: As a Sinux maintainer, I need well-structured reference API files so that the skill has accurate, detailed knowledge of each package's API.

**Acceptance Criteria**:
- [ ] Six reference files exist: `core-api.md`, `react-api.md`, `middleware-api.md`, `apollo-api.md`, `tanstack-query-api.md`, `patterns.md`
- [ ] Each API reference documents all public exports with TypeScript signatures
- [ ] Each reference includes usage examples for every documented API
- [ ] `patterns.md` covers cross-cutting usage patterns (multi-store, async, error handling)
- [ ] References match the currently published package versions

**Reference File Responsibilities**:

| File | Package | Key Exports |
|------|---------|-------------|
| `core-api.md` | `@sinuxjs/core` | `createStore`, `combine`, signal handlers, store API |
| `react-api.md` | `@sinuxjs/react` | `useStore`, `useSignal`, selector patterns |
| `middleware-api.md` | `@sinuxjs/core` | `persist`, `devtools`, `immer`, `MiddlewareConfig` |
| `apollo-api.md` | `@sinuxjs/apollo` | Apollo adapter, query/mutation signal integration |
| `tanstack-query-api.md` | `@sinuxjs/tanstack-query` | `querySignal`, `mutationSignal`, cache integration |
| `patterns.md` | Cross-package | Multi-store, async patterns, error handling, testing |

**Constraints**: Reference files are the skill's knowledge base. Inaccurate references lead to Claude generating incorrect code. Accuracy is non-negotiable.

**Dependencies**: All four @sinuxjs packages — references must reflect their current public APIs.

**Technical Context**: References are loaded by Claude Code when the skill is active. They should be concise but complete — focus on API surface and correct usage, not internal implementation.

---

### #plugin.skill.triggers

**User Story**: As a developer, I need the Sinux skill to activate automatically when I'm working with Sinux code so that I get relevant assistance without manually invoking it.

**Acceptance Criteria**:
- [ ] Skill triggers when code imports from any `@sinuxjs/*` package
- [ ] Skill triggers when user mentions Sinux, stores, signals in the context of state management
- [ ] `allowed-tools` is set to `Read` — skill can read files but not write
- [ ] Skill does not trigger for unrelated state management libraries (Redux, Zustand, Jotai)

**Trigger Mechanism**: The `description` field in SKILL.md frontmatter serves as the trigger text. Claude Code matches user context against this description to decide activation. Key trigger phrases:
- `@sinuxjs/core`, `@sinuxjs/react`, `@sinuxjs/tanstack-query`, `@sinuxjs/apollo`
- "creating stores", "writing signal handlers", "building middleware"
- "integrating with TanStack Query or Apollo Client"
- "any Sinux-related code"

**Allowed Tools Policy**:
- `Read` — skill can read project files to understand context
- Write/Edit are NOT granted — the skill teaches; Claude's own capabilities handle code generation

**Constraints**: The trigger description must be specific enough to avoid false activations on non-Sinux state management code.

**Dependencies**: `#plugin.skill.content` — triggers are defined in SKILL.md frontmatter.

**Technical Context**: Claude Code's skill activation is description-based, not import-scanning. The description must contain the right keywords to match developer intent.

---

### #plugin.maintenance.sync

**User Story**: As a Sinux maintainer, I need a clear process for keeping the plugin in sync with package releases so that the skill never teaches outdated APIs.

**Acceptance Criteria**:
- [ ] Version in `plugin.json` and `marketplace.json` tracks the latest @sinuxjs package version
- [ ] Reference API files are updated when public API changes are made to any package
- [ ] SKILL.md `metadata.version` reflects the current teaching content version
- [ ] A checklist exists for what to update on each package release

**Release Sync Checklist**:
1. Update `plugin.json` version
2. Update `marketplace.json` version (if marketplace spec is active)
3. Review each reference file against package changelog
4. Update SKILL.md examples if API signatures changed
5. Bump `metadata.version` in SKILL.md frontmatter
6. Run skill validation if available

**Constraints**: Reference files must be updated in the same PR as package API changes to prevent drift.

**Dependencies**: All @sinuxjs packages, `#marketplace.registry.config`.

**Technical Context**: The plugin is in-repo (`plugins/sinux-plugin/`) so it can be updated alongside package code. This co-location is intentional — it enables atomic updates.

---

### #marketplace.registry.config

**User Story**: As a developer discovering Sinux, I need a marketplace.json so that the plugin is findable and installable from the Claude Code marketplace.

**Acceptance Criteria**:
- [ ] `marketplace.json` exists at plugin root or repo root with required fields
- [ ] Fields include: name, description, version, author, repository, keywords
- [ ] Version field stays in sync with `plugin.json` version
- [ ] Description includes all @sinuxjs package names and key concepts (stores, signals, middleware)

**Expected marketplace.json Structure**:
```json
{
  "name": "sinux-plugin",
  "description": "Sinux skill for Claude Code — teaches stores, signals, middleware, React hooks, TanStack Query, and Apollo Client integration",
  "version": "1.0.0",
  "author": "jbpin",
  "repository": "https://github.com/jbpin/sinux",
  "keywords": ["sinux", "state-management", "signals", "react", "flux"]
}
```

**Constraints**: `marketplace.json` must stay in sync with `plugin.json` version. The name field must match across both files.

**Dependencies**: `#plugin.structure.layout`, `#plugin.maintenance.sync`.

**Technical Context**: The marketplace is git-based. `marketplace.json` provides metadata for discovery but installation is done via git clone, not a package registry.

---

### #marketplace.install.flow

**User Story**: As a developer, I need to install the Sinux skill in 2 commands or fewer so that adoption friction is minimal.

**Acceptance Criteria**:
- [ ] Installation requires exactly 2 commands: `git clone` + `claude install`
- [ ] No npm publish or registry setup required
- [ ] Post-install, the skill appears in Claude Code's skill list
- [ ] Installation works from the monorepo root or the plugin subdirectory

**Installation Flow**:
```bash
# Option A: From existing clone (already using Sinux)
claude plugin install ./plugins/sinux-plugin

# Option B: Standalone install
git clone https://github.com/jbpin/sinux.git
claude plugin install ./sinux/plugins/sinux-plugin
```

**Constraints**: Must not require npm publish. Git-based distribution requires no infrastructure beyond the GitHub repo.

**Dependencies**: `#plugin.structure.layout`, `#marketplace.registry.config`.

**Technical Context**: The `claude plugin install` command reads `.claude-plugin/plugin.json` and registers the skill. The git-based approach means updates are pulled via `git pull` rather than version bumps in a registry.

## Spekn Tracking Rules

- Treat this document as locked context; do not reinterpret requirements outside Spekn flow.
- Review `../decisions/INDEX.md` before implementation and whenever scope changes.
- If implementation conflicts with this spec or approved decisions, stop and escalate for a Spekn decision update.

## Related Decisions

- Shorthand index: [Approved Decisions](../decisions/INDEX.md)
