/* ============================================================
   FIRE STORE — SHARED CAMPAIGN UTILITIES
   campaign-utils.js

   Deadline formatting and analytics tracking shared by every
   campaign module (winback.js, nfl.js, …). Extracted so a second
   campaign doesn't duplicate the same ~30 lines.
   ============================================================ */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'campaign_utms';

/* ---- UTM capture (shared across campaigns — only one campaign is ever live) ---- */

export function captureUtms() {
  try {
    const params = new URLSearchParams(location.search);
    const existing = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
    let changed = false;
    UTM_KEYS.forEach(k => {
      const v = params.get(k);
      if (v && existing[k] !== v) { existing[k] = v; changed = true; }
    });
    if (changed) sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(existing));
    return existing;
  } catch (_) {
    return {};
  }
}

function readUtms() {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
  } catch (_) {
    return {};
  }
}

/* ---- analytics ------------------------------------------------------------ */

export function track(campaign, event, params = {}) {
  const utms = readUtms();
  const base = {
    campaign,
    source: utms.utm_source || 'direct',
    ...utms,
  };
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, { ...base, ...params });
  }
}

/* ---- deadline formatting ------------------------------------------------- */

/**
 * Formats an ISO-8601 deadline in its own timezone (taken from the ISO
 * offset), never the visitor's. e.g. "Sat, Sep 14 · 11:59 PM ET"
 */
export function formatDeadline(iso, tzLabel) {
  if (!iso) return '';

  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  // Shift the instant so that reading it as UTC yields the campaign-tz wall clock.
  const m = iso.match(/([+-])(\d{2}):?(\d{2})$/);
  let shifted = date;
  if (m) {
    const sign = m[1] === '-' ? -1 : 1;
    const offsetMin = sign * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10));
    shifted = new Date(date.getTime() + offsetMin * 60000);
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZone: 'UTC',
  }).formatToParts(shifted).reduce((acc, p) => (acc[p.type] = p.value, acc), {});

  const stamp = `${parts.weekday}, ${parts.month} ${parts.day} · ${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
  return tzLabel ? `${stamp} ${tzLabel}` : stamp;
}
