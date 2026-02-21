# exPOTUS

Fun facts about ex-Presidents of the United States.

A static site that tracks the lives and careers of ex-Presidents after they leave office — what notable activities they engaged in, how long they lived as ex-presidents, and how the number of living ex-presidents changed over time.

## Pages

- **Ex-Presidents** — sortable list of all ex-presidents with their tenure dates and durations
- **Facts** — all historical facts across all ex-presidents
- **Eras** — timeline of periods when the number of living ex-presidents changed
- **About** — background on the project

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
npm run preview   # preview the built site locally
```

## Updating Data

Each ex-president is a Markdown file in `src/content/presidents/`. Files are named `lastname-firstname.md` (e.g., `obama.md`, `bush-george-w.md`). Cleveland has two entries (`cleveland-1st.md`, `cleveland-2nd.md`).

**Frontmatter fields:**
- `id` — ordinal number (1-indexed, Cleveland counted once)
- `firstName`, `lastName`, `uniqueName` (optional display override)
- `startDate`, `endDate` — ex-presidency span (omit `endDate` if still living)
- `startTime`, `endTime` — millisecond offsets for same-day ordering (rarely needed)
- `facts[]` — array of fact objects:
  - `detail` — description; may include HTML (e.g., `<cite>` tags)
  - `startDate`, `endDate` — optional date range for the fact
  - `citation` — optional source URL
  - `citationDate` — required (YYYY-MM-DD) whenever `citation` is set

Dates support partial formats: `"1941"` (year only), `"1941-12"` (year and month), or `"1941-12-07"` (full date).

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
    citationDate: "2024-01-01"
---
```

## Deployment

The site is configured for GitHub Pages. Update `site` and `base` in `astro.config.mjs` to match your GitHub username and repository name.

## Built With

[Astro](https://astro.build)
