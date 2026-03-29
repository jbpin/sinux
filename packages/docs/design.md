# Sinux Brand Design Guide

## Brand Concept: "Signal Flow"

Sinux is built on **signals** — discrete, named, composable commands that flow through a store. The brand evokes **signal propagation**: clean, directional, wave-like. Every visual and verbal choice reinforces the idea that state management should feel like a signal flowing from intent to outcome.

Core metaphor: **Signal in, state out.**

---

## UX Laws Applied to Sinux Docs

| Law | Application |
|-----|-------------|
| **Aesthetic-Usability Effect** | A polished, branded docs site signals quality. Users trust well-designed tools more and forgive minor issues. The Electric Violet palette and clean typography build that trust before the first line of code. |
| **Law of Pragnanz** | Keep every page as simple as possible. One concept per page. Feature cards use 3 items, not 5. Diagrams use minimal shapes. The logo is a sine wave ending in an arrow — nothing extra. |
| **Law of Similarity** | All code examples use the same structure: import, create, use. All API pages follow the same template. Consistent patterns let users transfer knowledge across pages. |
| **Von Restorff Effect** | Key concepts (signals, stores, middleware) are highlighted with the accent color (Signal Pink `#FD79A8`). Important warnings and tips use distinct callout blocks so they stand out from body text. |
| **Jakob's Law** | Follow Mintlify conventions. Users expect a sidebar, a search bar, light/dark toggle, and "Edit this page" links. Don't reinvent navigation — leverage familiarity. |
| **Miller's Law** | No more than 7 items in any navigation section. The sidebar has 6 top-level entries. Feature cards show 3 items. API tables chunk parameters into logical groups. |
| **Hick's Law** | Reduce choices at every step. The landing page has one CTA: "Get Started." The sidebar guides a linear path from intro to advanced. No decision paralysis. |
| **Serial Position Effect** | Put the most important items first and last in every list. "Getting Started" is first in the sidebar. "Examples" is last — users remember beginnings and endings. |
| **Paradox of Active User** | Developers don't read docs linearly — they search, scan, and copy. Every page starts with a code example. API signatures appear before explanations. Copy buttons on all code blocks. |
| **Goal-Gradient Effect** | Show progress. The sidebar doubles as a learning path. Each page ends with a "Next" link. Users can see how close they are to understanding the full API. |
| **Chunking** | Group related concepts into categories: Concepts, React, Middlewares, Integrations, Examples. Within each page, use headings to chunk content into scannable sections. |
| **Cross-referencing** | On first mention of any concept (store, signal, middleware, computed), link to its dedicated page. Users can drill down without losing context. |
| **Diataxis Framework** | Organize docs into four modes: **Tutorials** (learning-oriented), **How-to Guides** (task-oriented), **Reference** (information-oriented), **Explanation** (understanding-oriented). The sidebar reflects this structure. |

---

## Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | Electric Violet | `#6C5CE7` | Links, buttons, headings, interactive elements |
| **Secondary** | Teal Pulse | `#00CEC9` | Success states, secondary actions, badges |
| **Accent** | Signal Pink | `#FD79A8` | Highlights, callouts, important warnings |
| **Neutral Dark** | Charcoal | `#2D3436` | Body text (light mode), borders |
| **Neutral Light** | Mist | `#DFE6E9` | Borders (light mode), subtle backgrounds |
| **Background Light** | Snow | `#FAFAFA` | Page background (light mode) |
| **Background Dark** | Midnight | `#1A1A2E` | Page background (dark mode) |

### Contrast Ratios
- Primary on Background Light: 5.2:1 (AA compliant)
- Primary Light on Background Dark: 5.8:1 (AA compliant)
- Neutral Dark on Background Light: 13.4:1 (AAA compliant)

---

## Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| **Headings** | Inter | 700 (Bold) | h1: 2.5rem, h2: 2rem, h3: 1.5rem |
| **Body** | Inter | 400 (Regular) | 1rem (16px) |
| **Code** | JetBrains Mono | 400 | 90% of body |
| **Code headings** | JetBrains Mono | 600 | 1rem |

Import via Google Fonts:
```
Inter:wght@400;500;600;700
JetBrains+Mono:wght@400;600
```

---

## Logo

**Concept**: A sine wave that morphs into a forward-pointing arrow.

**Meaning**: Signal (sine wave) flows into action (arrow) which produces state (the destination). This captures the Sinux data flow: `signal -> dispatch -> state`.

**Specifications**:
- ViewBox: 40x40
- Primary color: `#6C5CE7`
- Stroke-based, no fill
- Stroke width: 2.5px
- Clean, geometric, recognizable at small sizes

**Usage**:
- Navbar: 32x32px
- Favicon: 16x16px and 32x32px
- Social cards: centered, with title below

---

## Voice & Tone

| Principle | Example |
|-----------|---------|
| **Direct** | "Create a store" not "You might want to consider creating a store" |
| **Confident** | "Signals are async" not "Signals can be used in an async manner" |
| **Concise** | One sentence per concept. Cut filler words. |
| **Code-first** | Show the code, then explain it. Never explain without code. |

### Writing Rules
1. Start every page with a working code example
2. Use active voice
3. Address the reader as "you"
4. Keep paragraphs to 3 sentences max
5. Use tables for structured data (API params, options)
6. Use admonitions sparingly — max 2 per page

---

## Documentation Patterns

### Page Structure
1. **Code example** — working, copy-pasteable
2. **One-line summary** — what this concept does
3. **Detailed explanation** — how and why
4. **API reference** — types, parameters, return values
5. **See also** — cross-references to related concepts

### Navigation Rules
- Max 2 levels of hierarchy in the sidebar
- Max 7 items per navigation section (Miller's Law)
- Cross-reference on first mention of any concept
- Every page has a "Next" link

### Code Examples
- Always show imports
- Use TypeScript
- Keep examples under 20 lines
- Show the happy path first, edge cases second
- All examples must be runnable
