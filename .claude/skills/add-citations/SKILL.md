---
name: add-citations
description: Find and add missing (or stale) citations to president facts. Invoke with an optional count, e.g. "add citations for 5 facts".
argument-hint: [count]
---

# add-citations skill

When invoked, follow these steps to research and add missing citations to president facts.

## 1. Parse the argument

Read the argument as an integer N (default: 5). This is the maximum number of facts to attempt across the entire run.

## 2. Create a branch

Determine today's date in YYYY-MM-DD format. Create and switch to a new branch:

```
git checkout -b add-citations-<YYYY-MM-DD>
```

If a branch with that name already exists, append `-2`, `-3`, etc.

## 3. Identify facts needing citations

Run the audit script and capture JSON output:

```
npm run audit-citations -- --format json
```

From the output:
- Fill your work queue with up to N items from `missing` first
- If slots remain after exhausting `missing`, fill from `stale` (most stale first — they are already sorted)

If both arrays are empty, inform the user and stop — no branch or PR needed.

## 4. Research each citation

For each fact in your work queue, search the web for a reliable, publicly accessible source. Track every attempt in a results log (see step 6).

### Source quality — prefer in this order:

1. **Presidential library websites** — millercenter.org, reaganlibrary.gov, clintonlibrary.gov, georgebush-library.gov, jimmycarterlibrary.gov, etc.
2. **Government and official sources** — .gov domains, congressional records, White House archives
3. **The American Presidency Project** — ucsb.edu/ws/index.php (primary source compilation)
4. **Established news organizations** — AP, Reuters, NPR, PBS, C-SPAN, major newspapers (NYT, WaPo, WSJ, etc.)
5. **Academic or reference sources** — university libraries, Britannica, scholarly publications
6. **Wikipedia** — only as a last resort; accept only if a better source genuinely cannot be found after exhausting the above

Do **not** add:
- A URL you cannot verify is real and publicly accessible (no fabricated URLs)
- A paywalled article where no preview or abstract is available
- A source that does not actually support the specific fact

### Search effort limit

Spend at most **10 distinct search queries** per fact. If no acceptable source is found after 10 attempts, mark the fact as **not found** and move on. Do not spin forever on a single hard fact.

### Citation fields to write

- `citation`: the URL of the source
- `citationDate`: today's date in `YYYY-MM-DD` format (the date you accessed/verified it)

## 5. Update president files

For each **successful** find, edit the corresponding file in `src/content/presidents/`. Add `citation` and `citationDate` to the matching fact. Preserve all existing YAML formatting and field order — add the new fields after `detail`/`startDate`/`endDate` and before any other existing fields.

**For missing citations** — add both fields:
```yaml
  - detail: "Some fact"
    startDate: "1985"
    citation: "https://example.com/source"
    citationDate: "2026-02-20"
```

**For stale citations** — update both fields in place:
```yaml
    citation: "https://new-or-same-url.com"
    citationDate: "2026-02-20"
```

## 6. Commit changes

If at least one file was updated, stage and commit only the changed files:

```
git add src/content/presidents/<file1>.md src/content/presidents/<file2>.md ...
git commit -m "Add citations for <N> facts"
```

If no files were updated (all facts were not found), still push the branch but note in the PR that no changes were made.

## 7. Open a pull request

Push the branch and open a PR. Use this body format:

```
## Summary

Attempted to find citations for <total> fact(s) — <success> added, <failure> not found.

## Results

| President | Fact (truncated) | Result | Source |
|-----------|-----------------|--------|--------|
| Barack Obama | "Published memoir A Promised Land" | ✅ Found | https://... |
| Jimmy Carter | "Taught Sunday school at Maranatha..." | ❌ Not found | — |

## Notes

- Sources used were checked for accessibility and relevance on <today's date>
- Wikipedia was used for: <list any, or "none">
- Facts marked ❌ may need manual research
```

If all facts were not found, include a brief note explaining what searches were tried.
