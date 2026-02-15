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

Each ex-president is a markdown file in `src/content/presidents/`. To add or update a president, edit the frontmatter:

```markdown
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
---
```

Dates in facts support partial formats: `"1941"` (year only), `"1941-12"` (year and month), or `"1941-12-07"` (full date). Omit `endDate` for a president who is still living.

## Deployment

The site is configured for GitHub Pages. Update `site` and `base` in `astro.config.mjs` to match your GitHub username and repository name.

## Built With

[Astro](https://astro.build)
