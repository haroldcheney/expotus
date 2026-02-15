/**
 * Parses devDb.script and generates markdown content files for Astro.
 * Run with: node scripts/convert-data.mjs
 */
import { readFileSync, mkdirSync, writeFileSync } from 'fs';

const db = readFileSync('devDb.script', 'utf-8');

// Parse EXPOTUS inserts
// FORMAT: INSERT INTO EXPOTUS VALUES(ID,VERSION,'END_DATE','FIRST_NAME','LAST_NAME','START_DATE','UNIQUE_NAME',END_TIME,START_TIME)
const presidents = [];
const presidentRegex = /INSERT INTO EXPOTUS VALUES\((\d+),\d+,(NULL|'[^']*'),'([^']*)','([^']*)','([^']*)',(NULL|'[^']*'),(\d+),(\d+)\)/g;

let match;
while ((match = presidentRegex.exec(db)) !== null) {
  const [, id, endDateRaw, firstName, lastName, startDate, uniqueNameRaw, endTime, startTime] = match;
  presidents.push({
    id: parseInt(id),
    firstName,
    lastName,
    startDate,
    endDate: endDateRaw === 'NULL' ? null : endDateRaw.replace(/'/g, ''),
    uniqueName: uniqueNameRaw === 'NULL' ? null : uniqueNameRaw.replace(/'/g, ''),
    startTime: parseInt(startTime),
    endTime: parseInt(endTime),
    facts: [],
  });
}

// Parse FACT inserts
// FORMAT: INSERT INTO FACT VALUES(ID,VERSION,'DETAIL',EXPOTUS_ID,'END_DATE','START_DATE')
const factRegex = /INSERT INTO FACT VALUES\((\d+),\d+,'((?:[^']|'')*)',(\d+),(NULL|'[^']*'),(NULL|'[^']*')\)/g;

while ((match = factRegex.exec(db)) !== null) {
  const [, factId, detail, expotusId, endDateRaw, startDateRaw] = match;
  const president = presidents.find(p => p.id === parseInt(expotusId));
  if (president) {
    president.facts.push({
      id: parseInt(factId),
      detail: detail.replace(/''/g, "'"),
      startDate: startDateRaw === 'NULL' ? null : startDateRaw.replace(/'/g, ''),
      endDate: endDateRaw === 'NULL' ? null : endDateRaw.replace(/'/g, ''),
    });
  }
}

// Generate markdown files
mkdirSync('src/content/presidents', { recursive: true });

function slugify(firstName, lastName, uniqueName) {
  const name = uniqueName || `${firstName} ${lastName}`;
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function yamlString(value) {
  if (value === null || value === undefined) return 'null';
  // Escape strings that might need quoting
  if (value.includes(':') || value.includes('#') || value.includes('"') || value.includes("'") || value.includes(',') || value.includes('<') || value.includes('>')) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return `"${value}"`;
}

for (const p of presidents) {
  const slug = slugify(p.firstName, p.lastName, p.uniqueName);
  let content = '---\n';
  content += `id: ${p.id}\n`;
  content += `firstName: "${p.firstName}"\n`;
  content += `lastName: "${p.lastName}"\n`;
  if (p.uniqueName) {
    content += `uniqueName: "${p.uniqueName}"\n`;
  }
  content += `startDate: "${p.startDate}"\n`;
  if (p.endDate) {
    content += `endDate: "${p.endDate}"\n`;
  }
  content += `startTime: ${p.startTime}\n`;
  content += `endTime: ${p.endTime}\n`;

  if (p.facts.length > 0) {
    content += 'facts:\n';
    for (const f of p.facts) {
      content += `  - detail: ${yamlString(f.detail)}\n`;
      if (f.startDate) {
        content += `    startDate: "${f.startDate}"\n`;
      }
      if (f.endDate) {
        content += `    endDate: "${f.endDate}"\n`;
      }
    }
  }

  content += '---\n';

  writeFileSync(`src/content/presidents/${slug}.md`, content);
  console.log(`Created ${slug}.md (${p.facts.length} facts)`);
}

console.log(`\nGenerated ${presidents.length} president files.`);
