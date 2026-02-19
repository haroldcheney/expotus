# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**exPOTUS** is a static Astro site tracking ex-Presidents of the United States — their post-presidency activities, durations, and eras when the number of living ex-presidents changed.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server with hot reload
npm run build     # Build static site to /dist
npm run preview   # Preview built site locally
```

No test or lint commands are configured.

## Architecture

### Data Layer

Each ex-president is a Markdown file in `src/content/presidents/` with YAML frontmatter validated by Zod schema in `src/content.config.ts`. Files are named `lastname-firstname.md` (e.g., `obama.md`, `bush-george-w.md`). Cleveland has two entries (`cleveland-1st.md`, `cleveland-2nd.md`); multi-term or multi-person names use suffixes.

**President frontmatter fields:**
- `id` — ordinal number (1-indexed, Cleveland counted once)
- `firstName`, `lastName`, `uniqueName` (optional display override)
- `startDate`, `endDate` — ex-presidency span (omit `endDate` if still living)
- `startTime`, `endTime` — millisecond offsets for same-day ordering;
  -  `endTime` is only needed in the rare case when two ex-presidents die on the same day;
  - `startTime` would only be needed if two presidents left office on the same day (hopefully never needed)
- `facts[]` — array of `{ detail, startDate?, endDate?, citation? }`

**Partial date format:** Dates in facts support `"YYYY"`, `"YYYY-MM"`, or `"YYYY-MM-DD"`. All parsing/formatting is handled in `src/lib/dates.ts`.

### Pages & Routing

Astro file-based routing under `src/pages/`:
- `index.astro` — sortable table of all ex-presidents
- `facts.astro` — all facts across all presidents
- `eras.astro` — timeline of periods when ex-president count changed
- `about.astro` — project background (content from `src/content/about.md`)
- `presidents/[slug].astro` — individual president detail page (generated via `getStaticPaths()`)

### Key Libraries

- `src/lib/dates.ts` — date parsing, duration calculations, partial date formatting (ported from original Groovy app)
- `src/lib/eras.ts` — era calculation logic: tracks periods when the count of living ex-presidents changes

### Components

- `SortableTable.astro` — client-side sortable table using `data-sort-key`/`data-sort-value` attributes
- `Nav.astro` — site navigation with `active` prop for highlighting current page
- `Citation.astro` — renders citation/source links

### Styling

CSS lives in `public/styles/`. No CSS framework; plain CSS.

## Development Workflow

All work should follow this GitHub-based workflow:

1. **Start from an issue** — every piece of work must have a corresponding GitHub issue. Create one if it doesn't exist yet (`gh issue create`).
2. **Create a branch** — when starting work, create a branch named after the issue number and a short description (e.g., `42-fix-era-calculation`).
3. **Open a pull request** — when work is complete, open a PR that references the issue (e.g., "Closes #42" in the PR body). The PR will be merged into `master`.

```bash
gh issue create --title "..." --body "..."   # create an issue
git checkout -b 42-short-description         # create and switch to branch
gh pr create                                 # open a pull request when done
```

## Adding or Updating a President

Edit or create a file in `src/content/presidents/`. The `detail` field in facts may include HTML (e.g., `<cite>` tags) and is rendered with `set:html`.

Example:
```yaml
---
id: 36
firstName: "Barack"
lastName: "Obama"
startDate: "2017-01-20"
startTime: 0
endTime: 0
facts:
  - detail: "Published memoir <cite>A Promised Land</cite>"
    startDate: "2020-11-17"
    citation: "https://example.com/source"
---
```
