/* ============================================================
   FIRE STORE — CHANNELS PAGE DATA BUILDER
   scripts/build-channels.js

   Transforms the raw server export CSV into small per-country
   JSON files consumed by channels.html. Run manually whenever a
   fresh CSV is exported:

     npm run build:channels -- "C:\path\to\firestore_server_channels_by_country.csv"

   NOTE: the generated files publish the full channel lineup on a
   public page. Regenerate deliberately, review the summary log,
   and do not automate this blindly into CI.

   Cleaning applied:
   - drops stream_id / added columns (internal panel data)
   - drops separator rows (e.g. "##### NHL PPV #####")
   - drops dated one-off PPV event rows (stale within 24h)
   - dedupes exact duplicate names within a category
   ============================================================ */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const csvPath = process.argv[2];
if (!csvPath || !fs.existsSync(csvPath)) {
  console.error('Usage: node scripts/build-channels.js <path-to-channels-csv>');
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, '..', 'public', 'data', 'channels');

/* ── Minimal CSV parser (handles quoted fields with commas) ── */
function parseCsvLine(line) {
  const out = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

/* ── Cleaning rules ── */
const SEPARATOR_RE = /^#{2,}.*#{2,}$/;                              // ##### NHL PPV #####
const DATED_EVENT_RE = new RegExp(
  '\\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\\s+\\d{1,2}\\b' + // – JUL 4 –
  '|\\d{1,2}:\\d{2}\\s*(AM|PM)\\b',                                        // 3:00 PM ET
  'i'
);

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/* ── Read + parse ── */
let raw = fs.readFileSync(csvPath, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // strip BOM
const lines = raw.split(/\r?\n/);
const header = parseCsvLine(lines[0]);
const col = name => header.indexOf(name);
const C = {
  sort: col('sort_order'), country: col('country'), type: col('content_type'),
  cat: col('category_name'), name: col('channel_or_title'),
};
if (Object.values(C).some(i => i < 0)) {
  console.error('Unexpected CSV header:', header.join(','));
  process.exit(1);
}

// countries: slug -> { name, sort, live: Map<cat, Set<name>>, vod: Map<cat, n>, series: Map<cat, n> }
const countries = new Map();
let rowsIn = 0, dropSep = 0, dropDated = 0, dropDupe = 0, kept = 0;

for (let li = 1; li < lines.length; li++) {
  const line = lines[li];
  if (!line.trim()) continue;
  const f = parseCsvLine(line);
  rowsIn++;

  const countryName = f[C.country];
  const type = f[C.type];
  const cat = (f[C.cat] || '').trim() || 'OTHER';
  const name = (f[C.name] || '').trim();
  if (!countryName || !type || !name) continue;

  if (SEPARATOR_RE.test(name)) { dropSep++; continue; }
  const isLive = type === 'Live TV';
  if (isLive && DATED_EVENT_RE.test(name)) { dropDated++; continue; }

  const slug = slugify(countryName);
  if (!countries.has(slug)) {
    countries.set(slug, {
      name: countryName, sort: Number(f[C.sort]) || 999,
      live: new Map(), vod: new Map(), series: new Map(),
    });
  }
  const entry = countries.get(slug);

  if (isLive) {
    if (!entry.live.has(cat)) entry.live.set(cat, new Set());
    const set = entry.live.get(cat);
    if (set.has(name)) { dropDupe++; continue; }
    set.add(name);
  } else {
    const bucket = type === 'Series' ? entry.series : entry.vod; // "Movies / VOD"
    bucket.set(cat, (bucket.get(cat) || 0) + 1);
  }
  kept++;
}

/* ── Write output ── */
fs.mkdirSync(OUT_DIR, { recursive: true });

const sorted = [...countries.entries()].sort((a, b) => a[1].sort - b[1].sort);
const indexCountries = [];
const searchIndex = [];
let totLive = 0, totVod = 0, totSeries = 0;

for (const [slug, c] of sorted) {
  const live = [...c.live.entries()].map(([cat, set]) => ({ cat, channels: [...set] }));
  const vod = [...c.vod.entries()].map(([cat, count]) => ({ cat, count }));
  const series = [...c.series.entries()].map(([cat, count]) => ({ cat, count }));

  const liveCount = live.reduce((n, g) => n + g.channels.length, 0);
  const vodCount = vod.reduce((n, g) => n + g.count, 0);
  const seriesCount = series.reduce((n, g) => n + g.count, 0);
  totLive += liveCount; totVod += vodCount; totSeries += seriesCount;

  fs.writeFileSync(path.join(OUT_DIR, `${slug}.json`),
    JSON.stringify({ name: c.name, live, vod, series }));

  indexCountries.push({ slug, name: c.name, live: liveCount, vod: vodCount, series: seriesCount });

  // Dedupe (name, country) pairs — the same channel can sit in several
  // categories of one country; one search entry is enough.
  const seen = new Set();
  for (const g of live) for (const ch of g.channels) {
    if (!seen.has(ch)) { seen.add(ch); searchIndex.push([ch, slug]); }
  }
}

fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  totals: { live: totLive, vod: totVod, series: totSeries, countries: indexCountries.length },
  countries: indexCountries,
}));

fs.writeFileSync(path.join(OUT_DIR, 'search-live.json'), JSON.stringify(searchIndex));

/* ── Summary log ── */
const kb = f => (fs.statSync(path.join(OUT_DIR, f)).size / 1024).toFixed(0) + ' KB';
console.log(`rows in:          ${rowsIn}`);
console.log(`dropped:          ${dropSep} separators, ${dropDated} dated PPV events, ${dropDupe} duplicates`);
console.log(`kept:             ${kept}  (live ${totLive} · vod ${totVod} · series ${totSeries})`);
console.log(`countries:        ${indexCountries.length}`);
console.log(`files written:    ${indexCountries.length + 2} → public/data/channels/`);
console.log(`index.json:       ${kb('index.json')}`);
console.log(`search-live.json: ${kb('search-live.json')} (${searchIndex.length} entries)`);
