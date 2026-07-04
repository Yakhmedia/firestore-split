/* ============================================================
   FIRE STORE — CHANNELS PAGE
   channels.js

   Data: /data/channels/index.json      (loaded on page load, ~2 KB)
         /data/channels/<slug>.json     (lazy, per country selection)
         /data/channels/search-live.json (lazy, on first global search)
   ============================================================ */

const DATA = '/data/channels';
const LONG_CATEGORY = 200;   // channels shown before "Show all N"
const MAX_RESULTS = 50;      // search results rendered per step

let indexData = null;                 // index.json
const countryCache = new Map();       // slug -> country json
let searchIndex = null;               // search-live.json ([[name, slug], ...])
let searchIndexPromise = null;
let currentSlug = null;
let currentTab = 'live';

/* Country aliases for the search box (lowercase → slug) */
const COUNTRY_ALIASES = {
  usa: 'usa', us: 'usa', america: 'usa', 'united states': 'usa', american: 'usa',
  uk: 'uk', britain: 'uk', british: 'uk', england: 'uk', 'united kingdom': 'uk',
  canada: 'canada', quebec: 'canada',
  latino: 'latino-spanish', spanish: 'latino-spanish', mexico: 'latino-spanish', 'latin america': 'latino-spanish',
  france: 'france', french: 'france', belgium: 'france',
  germany: 'germany', german: 'germany', deutschland: 'germany', austria: 'germany',
  italy: 'italy', italian: 'italy', italia: 'italy',
  portugal: 'portugal-brazil', brazil: 'portugal-brazil', brasil: 'portugal-brazil', portuguese: 'portugal-brazil',
  netherlands: 'netherlands', holland: 'netherlands', dutch: 'netherlands',
  spain: 'spain', espana: 'spain', españa: 'spain',
  ireland: 'ireland', irish: 'ireland',
  australia: 'australia-new-zealand', 'new zealand': 'australia-new-zealand', aussie: 'australia-new-zealand',
  india: 'india-south-asia', hindi: 'india-south-asia', pakistan: 'india-south-asia', bangla: 'india-south-asia', tamil: 'india-south-asia', punjabi: 'india-south-asia',
  arabic: 'arabic-middle-east', arab: 'arabic-middle-east', 'middle east': 'arabic-middle-east', egypt: 'arabic-middle-east', morocco: 'arabic-middle-east', saudi: 'arabic-middle-east',
  turkey: 'turkey', turkish: 'turkey',
  africa: 'africa', african: 'africa', nigeria: 'africa', somalia: 'africa',
  caribbean: 'caribbean',
  philippines: 'philippines', filipino: 'philippines', pinoy: 'philippines',
  china: 'china-east-asia', chinese: 'china-east-asia', korea: 'china-east-asia', japan: 'china-east-asia', asia: 'china-east-asia', vietnam: 'china-east-asia', thailand: 'china-east-asia',
  balkans: 'eastern-europe-balkans', albania: 'eastern-europe-balkans', greece: 'eastern-europe-balkans', greek: 'eastern-europe-balkans', poland: 'eastern-europe-balkans', polish: 'eastern-europe-balkans', romania: 'eastern-europe-balkans', russia: 'eastern-europe-balkans', exyu: 'eastern-europe-balkans', serbia: 'eastern-europe-balkans', bulgaria: 'eastern-europe-balkans',
  scandinavia: 'scandinavia', sweden: 'scandinavia', norway: 'scandinavia', denmark: 'scandinavia', finland: 'scandinavia', iceland: 'scandinavia', nordic: 'scandinavia',
  international: 'international-other', other: 'international-other', world: 'international-other',
};

/* ── Utilities ── */
const $ = id => document.getElementById(id);
const fmt = n => n >= 1000 ? `${Math.floor(n / 1000)},${String(n % 1000).padStart(3, '0')}` : String(n);
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.json();
}

/* ── Boot: index.json → stats + pills ── */
async function boot() {
  initNavToggle();
  try {
    indexData = await fetchJson(`${DATA}/index.json`);
  } catch (e) {
    $('browserEmpty').innerHTML = '<p>Channel list is temporarily unavailable — <a href="https://wa.me/12029927413">ask us on WhatsApp</a>.</p>';
    return;
  }

  const t = indexData.totals;
  $('statLive').textContent = fmt(t.live) + '+';
  $('statVod').textContent = fmt(t.vod) + '+';
  $('statSeries').textContent = fmt(t.series) + '+';
  $('statCountries').textContent = t.countries;

  const pills = $('countryPills');
  indexData.countries.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'country-pill';
    btn.dataset.slug = c.slug;
    btn.innerHTML = `${c.name} <span class="pill-count">${fmt(c.live)}</span>`;
    btn.addEventListener('click', () => selectCountry(c.slug));
    pills.appendChild(btn);
  });

  initSearch();
  initTabs();

  // Deep link: ?country=usa  (+ optional #live|#movies|#series)
  const param = new URLSearchParams(location.search).get('country');
  const hashTab = { '#movies': 'vod', '#series': 'series', '#live': 'live' }[location.hash];
  if (hashTab) currentTab = hashTab;
  if (param && indexData.countries.some(c => c.slug === param)) selectCountry(param);
}

/* ── Country selection ── */
async function selectCountry(slug, { highlight = null } = {}) {
  currentSlug = slug;
  document.querySelectorAll('.country-pill').forEach(p =>
    p.classList.toggle('active', p.dataset.slug === slug));

  const url = new URL(location);
  url.searchParams.set('country', slug);
  history.replaceState(null, '', url);

  $('browserEmpty').hidden = true;
  $('browserError').hidden = true;
  $('browserContent').hidden = true;

  let data = countryCache.get(slug);
  if (!data) {
    $('browserLoading').hidden = false;
    try {
      data = await fetchJson(`${DATA}/${slug}.json`);
      countryCache.set(slug, data);
    } catch (e) {
      $('browserLoading').hidden = true;
      $('browserError').hidden = false;
      $('browserRetry').onclick = () => selectCountry(slug, { highlight });
      return;
    }
    $('browserLoading').hidden = true;
  }

  $('browserTitle').textContent = data.name;
  $('browserContent').hidden = false;
  renderTab(currentTab, highlight);
  if (highlight) document.querySelector('.channels-browser')?.scrollIntoView({ behavior: 'smooth' });
}

/* ── Tabs ── */
function initTabs() {
  $('browserTabs').querySelectorAll('.browser-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      location.hash = { live: 'live', vod: 'movies', series: 'series' }[currentTab];
      renderTab(currentTab);
    });
  });
}

function renderTab(tab, highlight = null) {
  const data = countryCache.get(currentSlug);
  if (!data) return;

  document.querySelectorAll('.browser-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));

  const counts = {
    live: data.live.reduce((n, g) => n + g.channels.length, 0),
    vod: data.vod.reduce((n, g) => n + g.count, 0),
    series: data.series.reduce((n, g) => n + g.count, 0),
  };
  const labels = { live: '📺 Live TV', vod: '🎬 Movies', series: '📼 Series' };
  document.querySelectorAll('.browser-tab').forEach(b => {
    b.textContent = `${labels[b.dataset.tab]} (${fmt(counts[b.dataset.tab])})`;
  });

  const list = $('browserList');
  list.innerHTML = '';

  if (tab === 'live') renderLive(list, data.live, highlight);
  else renderCounts(list, tab === 'vod' ? data.vod : data.series);
}

/* Live: category accordions, channel list rendered on expand */
function renderLive(list, groups, highlight = null) {
  groups.forEach(g => {
    const item = document.createElement('div');
    item.className = 'cat-item';
    const isPPV = /PPV/i.test(g.cat);
    item.innerHTML = `
      <button class="cat-q">
        <span dir="auto">${g.cat} <span class="cat-count">(${g.channels.length})</span></span>
        <span class="faq-icon">+</span>
      </button>
      <div class="cat-a"></div>`;
    const btn = item.querySelector('.cat-q');
    const body = item.querySelector('.cat-a');
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      if (open && !body.dataset.rendered) {
        body.dataset.rendered = '1';
        renderChannelList(body, g.channels, isPPV);
      }
    });
    list.appendChild(item);

    if (highlight && g.channels.includes(highlight)) {
      btn.click();
      setTimeout(() => {
        const el = [...body.querySelectorAll('li')].find(li => li.textContent === highlight);
        if (el) { el.classList.add('channel-highlight'); el.scrollIntoView({ block: 'center' }); }
      }, 0);
    }
  });
}

function renderChannelList(body, channels, isPPV) {
  if (isPPV) {
    const note = document.createElement('p');
    note.className = 'ppv-note';
    note.textContent = '⚡ Live events in this category are added daily — lineup below is the permanent slots.';
    body.appendChild(note);
  }
  const ul = document.createElement('ul');
  ul.className = 'channel-name-list';
  const renderSlice = (from, to) => {
    channels.slice(from, to).forEach(ch => {
      const li = document.createElement('li');
      li.dir = 'auto';
      li.textContent = ch;
      ul.appendChild(li);
    });
  };
  renderSlice(0, LONG_CATEGORY);
  body.appendChild(ul);
  if (channels.length > LONG_CATEGORY) {
    const more = document.createElement('button');
    more.className = 'show-all-btn';
    more.textContent = `Show all ${channels.length}`;
    more.addEventListener('click', () => { renderSlice(LONG_CATEGORY, channels.length); more.remove(); });
    body.appendChild(more);
  }
}

/* Movies / Series: category cards with counts only */
function renderCounts(list, groups) {
  const grid = document.createElement('div');
  grid.className = 'count-grid';
  groups.forEach(g => {
    const card = document.createElement('div');
    card.className = 'count-card';
    card.innerHTML = `<span dir="auto">${g.cat}</span><span class="count-num">${fmt(g.count)} titles</span>`;
    grid.appendChild(card);
  });
  list.appendChild(grid);
}

/* ── Search ── */
function initSearch() {
  const input = $('channelSearch');
  const panel = $('searchResults');
  let timer = null;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => runSearch(input.value), 150);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.channels-search-wrap')) panel.hidden = true;
  });
  input.addEventListener('focus', () => { if (panel.innerHTML) panel.hidden = false; });
}

function ensureSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = fetchJson(`${DATA}/search-live.json`)
      .then(d => { searchIndex = d; })
      .catch(() => { searchIndexPromise = null; });
  }
  return searchIndexPromise;
}

async function runSearch(query) {
  const panel = $('searchResults');
  const q = norm(query.trim());
  if (q.length < 2) { panel.hidden = true; panel.innerHTML = ''; return; }

  /* 1 — country matches (names + aliases) */
  const slugs = new Set();
  indexData.countries.forEach(c => { if (norm(c.name).includes(q)) slugs.add(c.slug); });
  for (const [alias, slug] of Object.entries(COUNTRY_ALIASES)) {
    if (alias.startsWith(q) || (alias.length >= 3 && q.includes(alias))) slugs.add(slug);
  }
  const countryMatches = indexData.countries.filter(c => slugs.has(c.slug));

  // Render country matches immediately — don't make them wait for the
  // (lazy, ~1 MB) global channel index on first search.
  renderSearchResults(panel, countryMatches, [], q, /*pending*/ true);

  /* 2 — channel matches */
  let channelMatches = [];
  if (currentSlug && countryCache.has(currentSlug)) {
    // in-country instant filter
    const data = countryCache.get(currentSlug);
    for (const g of data.live) {
      for (const ch of g.channels) {
        if (norm(ch).includes(q)) channelMatches.push([ch, currentSlug]);
        if (channelMatches.length > 400) break;
      }
    }
  } else {
    // global index (lazy-loaded on first search)
    await ensureSearchIndex();
    if (norm($('channelSearch').value.trim()) !== q) return; // stale keystroke
    if (searchIndex) {
      for (const entry of searchIndex) {
        if (norm(entry[0]).includes(q)) {
          channelMatches.push(entry);
          if (channelMatches.length > 400) break;
        }
      }
    }
  }

  renderSearchResults(panel, countryMatches, channelMatches, q);
}

function renderSearchResults(panel, countries, channels, q, pending = false) {
  panel.innerHTML = '';
  panel.hidden = false;

  if (countries.length) {
    const h = document.createElement('div');
    h.className = 'search-group-label';
    h.textContent = `Countries (${countries.length})`;
    panel.appendChild(h);
    countries.forEach(c => {
      const row = document.createElement('button');
      row.className = 'search-row';
      row.innerHTML = `🌍 <strong>${c.name}</strong> <span class="pill-count">${fmt(c.live)} live channels</span>`;
      row.addEventListener('click', () => {
        panel.hidden = true;
        $('channelSearch').value = '';
        selectCountry(c.slug);
        document.querySelector('.channels-browser')?.scrollIntoView({ behavior: 'smooth' });
      });
      panel.appendChild(row);
    });
  }

  if (channels.length) {
    const nameBySlug = Object.fromEntries(indexData.countries.map(c => [c.slug, c.name]));
    const h = document.createElement('div');
    h.className = 'search-group-label';
    h.textContent = `Channels (${channels.length > 400 ? '400+' : channels.length}${channels.length > MAX_RESULTS ? `, showing ${MAX_RESULTS}` : ''})`;
    panel.appendChild(h);

    let shown = 0;
    const renderMore = () => {
      const slice = channels.slice(shown, shown + MAX_RESULTS);
      shown += slice.length;
      slice.forEach(([ch, slug]) => {
        const row = document.createElement('button');
        row.className = 'search-row';
        row.innerHTML = `<span dir="auto">📺 ${ch}</span> <span class="pill-count">${nameBySlug[slug] || slug}</span>`;
        row.addEventListener('click', () => {
          panel.hidden = true;
          selectCountry(slug, { highlight: ch });
        });
        panel.appendChild(row);
      });
      if (shown < channels.length) {
        const more = document.createElement('button');
        more.className = 'show-all-btn';
        more.textContent = 'Show more';
        more.addEventListener('click', () => { more.remove(); renderMore(); });
        panel.appendChild(more);
      }
    };
    renderMore();
  }

  if (pending) {
    const note = document.createElement('div');
    note.className = 'search-group-label';
    note.textContent = countries.length ? 'Searching channels…' : 'Searching…';
    panel.appendChild(note);
    return;
  }

  if (!countries.length && !channels.length) {
    panel.innerHTML = `
      <div class="search-empty">
        No match for "<strong>${q.replace(/</g, '&lt;')}</strong>" —
        <a href="https://wa.me/12029927413" target="_blank" rel="noopener">message us on WhatsApp</a>,
        we probably have it.
      </div>`;
  }
}

/* ── Mobile nav (same behavior as main.js) ── */
function initNavToggle() {
  const toggleBtn = $('navToggle');
  const navLinks = $('navLinks');
  if (!toggleBtn || !navLinks) return;
  toggleBtn.addEventListener('click', () => {
    const isActive = toggleBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', boot);
