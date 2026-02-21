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

Each ex-president is a Markdown file in `src/content/presidents/` with YAML frontmatter validated by Zod schema in `src/content.config.ts`. See README for file naming conventions and the full frontmatter field reference.

Date parsing for both the ex-presidency span and fact dates is handled by `src/lib/dates.ts`.

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
2. **Create a branch** — fetch the latest `master` from remote, then create a branch from it named after the issue number and a short description (e.g., `42-fix-era-calculation`).
3. **Open a pull request** — when work is complete, open a PR that references the issue (e.g., "Closes #42" in the PR body). The PR will be merged into `master`.

```bash
gh issue create --title "..." --body "..."           # create an issue
git fetch origin && git checkout -b 42-short-description origin/master  # branch from latest remote master
gh pr create                                          # open a pull request when done
```

## Adding or Updating a President

Edit or create a file in `src/content/presidents/`. See README for the field reference and an example. Note: the `detail` field is rendered with `set:html`, so HTML tags like `<cite>` are valid.
