/**
 * Audits president facts for missing or stale citations.
 *
 * Usage:
 *   node scripts/audit-citations.js              # both missing and stale
 *   node scripts/audit-citations.js missing      # only missing
 *   node scripts/audit-citations.js stale        # only stale
 *   node scripts/audit-citations.js -- --format json
 *   node scripts/audit-citations.js stale --format pretty
 *
 * Missing: fact has no citation field at all.
 * Stale: fact has a citation but citationDate is absent or older than one month.
 * Stale ordering: no citationDate first, then oldest date first.
 *
 * Exits with code 1 if any issues are found.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const presidentsDir = join(__dirname, '../src/content/presidents');

// --- Argument parsing ---

const args = process.argv.slice(2);
let filter = 'both'; // 'missing' | 'stale' | 'both'
let format = 'pretty'; // 'pretty' | 'json'

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--format' && args[i + 1]) {
    format = args[++i];
  } else if (arg === 'missing' || arg === 'stale') {
    filter = arg;
  }
}

// --- Load and parse all president files ---

const today = new Date();
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const missing = [];
const stale = []; // each entry gets a temporary _sortMs for ordering

const files = readdirSync(presidentsDir)
  .filter(f => f.endsWith('.md'))
  .sort();

for (const file of files) {
  const content = readFileSync(join(presidentsDir, file), 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) continue;

  const data = load(fmMatch[1]);
  const president = data.uniqueName || `${data.firstName} ${data.lastName}`;

  for (const fact of (data.facts ?? [])) {
    const detail = stripHtml(fact.detail ?? '');

    if (!fact.citation) {
      missing.push({ president, file, detail });
      continue;
    }

    if (!fact.citationDate) {
      // Citation present but no date — maximally stale
      stale.push({
        president, file, detail,
        citation: fact.citation,
        citationDate: null,
        _sortMs: -Infinity,
      });
      continue;
    }

    const citationDate = new Date(fact.citationDate);
    if (citationDate < oneMonthAgo) {
      stale.push({
        president, file, detail,
        citation: fact.citation,
        citationDate: fact.citationDate,
        _sortMs: citationDate.getTime(),
      });
    }
  }
}

// Sort stale: most stale first (null → oldest date)
stale.sort((a, b) => a._sortMs - b._sortMs);
stale.forEach(s => delete s._sortMs);

// --- Build result ---

const result = {};
if (filter !== 'stale') result.missing = missing;
if (filter !== 'missing') result.stale = stale;

const hasIssues = (result.missing?.length ?? 0) > 0 || (result.stale?.length ?? 0) > 0;

// --- Output ---

if (format === 'json') {
  console.log(JSON.stringify(result, null, 2));
} else {
  let first = true;

  if (result.missing !== undefined) {
    first = false;
    if (result.missing.length === 0) {
      console.log('Missing citations: none');
    } else {
      console.log('Missing citations:');
      for (const item of result.missing) {
        console.log(`  ${item.president} (${item.file})`);
        console.log(`    "${truncate(item.detail)}"`);
      }
    }
  }

  if (result.stale !== undefined) {
    if (!first) console.log();
    if (result.stale.length === 0) {
      console.log('Stale citations: none');
    } else {
      console.log('Stale citations:');
      for (const item of result.stale) {
        const dateLabel = item.citationDate ?? 'no date';
        console.log(`  ${item.president} (${item.file})`);
        console.log(`    "${truncate(item.detail)}"`);
        console.log(`    ${item.citation} [${dateLabel}]`);
      }
    }
  }
}

process.exit(hasIssues ? 1 : 0);

// --- Helpers ---

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '');
}

function truncate(str, max = 80) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}
