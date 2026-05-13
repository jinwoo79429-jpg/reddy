import type {
  Menu, Event, TigerConfig, PageData, SidebarData,
  Runner, OddsPoint, MarketOdds, EventDetail, CasinoGame,
} from './types';

const BASE_API = 'https://api.dcric99.com/api/guest';
const CDN_BASE  = 'https://speedcdn.io';
const ODDS_API  = 'https://odd.ocric99.com/ws/getMarketDataNew';

// Polling intervals (from original site bundle)
export const POLL_LIST_MS   = 10_000;  // home/sport list page — 10 s
export const POLL_DETAIL_MS =    600;  // match detail page    — 600 ms
export const POLL_SCORE_MS  =  1_000;  // score data           —   1 s

// Score iframe base URL (from bundle: ftLivetvData)
export const SCORE_IFRAME_BASE =
  'https://getscoredata.com/score/ffec941a1ae04d58ff65abfc58a2a60f83a0d9bb/';

// Pusher config (from bundle)
export const PUSHER_KEY     = 'df1d90ea66c0fd156347';
export const PUSHER_CLUSTER = 'ap2';

// ─── internal helpers ─────────────────────────────────────────────────────────

async function fetchJson<T>(url: string, opts?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

// Server-side fetch with Next.js ISR (safe for server components)
async function fetchJsonSSR<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

// ─── Server-side APIs (pass Cloudflare, safe to call in Server Components) ───

export async function fetchMenus(): Promise<Menu[]> {
  const data = await fetchJsonSSR<{ data: { menu: Menu[] } }>(`${BASE_API}/menu`);
  return data?.data?.menu ?? [];
}

export async function fetchEvents(): Promise<Event[]> {
  const data = await fetchJsonSSR<{ data: { events: Event[] } }>(`${BASE_API}/event_list`);
  return data?.data?.events ?? [];
}

export async function fetchTigerConfig(): Promise<TigerConfig | null> {
  return fetchJsonSSR<TigerConfig>(`${CDN_BASE}/frontend_config/tiger/tiger_config.json`);
}

// ─── Client-side APIs (require browser Cloudflare cookie) ────────────────────

/**
 * Single event detail with runners (name + selection_id) and embedded exchange odds.
 * Must be called from the browser, not from a Server Component.
 * Endpoint: GET /api/guest/event?event_id=X
 */
export async function fetchEventDetail(eventId: number): Promise<EventDetail | null> {
  const data = await fetchJson<{ data: EventDetail }>(
    `${BASE_API}/event?event_id=${eventId}`
  );
  return data?.data ?? null;
}

/**
 * Horse racing / greyhound racing events.
 * Endpoint: GET /api/guest/races
 */
export async function fetchRaces(): Promise<Event[]> {
  const data = await fetchJson<{ data: { events: Event[] } }>(`${BASE_API}/races`);
  return data?.data?.events ?? [];
}

/**
 * Casino Type-1 games (Indian casino section).
 * Endpoint: GET /api/guest/casino_1
 */
export async function fetchCasino1(): Promise<CasinoGame[]> {
  const data = await fetchJson<{ data: CasinoGame[] }>(`${BASE_API}/casino_1`);
  return Array.isArray(data?.data) ? data!.data : [];
}

/**
 * I-Casino games list.
 * Endpoint: GET /api/guest/casino_i_list_new
 */
export async function fetchCasinoI(): Promise<CasinoGame[]> {
  const data = await fetchJson<{ data: CasinoGame[] }>(`${BASE_API}/casino_i_list_new`);
  return Array.isArray(data?.data) ? data!.data : [];
}

/**
 * International casino games.
 * Endpoint: GET /api/guest/casino_int
 */
export async function fetchCasinoInt(): Promise<CasinoGame[]> {
  const data = await fetchJson<{ data: CasinoGame[] }>(`${BASE_API}/casino_int`);
  return Array.isArray(data?.data) ? data!.data : [];
}

// ─── Live odds (POST, browser-callable, CORS * allowed) ──────────────────────

/**
 * Parse the pipe-delimited market data string returned by /ws/getMarketDataNew.
 *
 * Format per market:
 *   marketId||STATUS|?|inPlay|matched|?|?|
 *   selId|STATUS|b1p|b1s|b2p|b2s|b3p|b3s|l1p|l1s|l2p|l2s|l3p|l3s|
 *   selId|STATUS|...
 */
export function parseMarketData(raw: string): { marketId: string; runners: Runner[] } {
  const parts = raw.split('|');
  const marketId = parts[0];
  const runners: Runner[] = [];

  let i = 8; // header is 8 fields (0-7)
  while (i < parts.length - 1) {
    const selIdStr = parts[i];
    const status   = parts[i + 1];

    if (!['ACTIVE', 'SUSPENDED', 'REMOVED', 'WINNER', 'LOSER'].includes(status)) {
      i++;
      continue;
    }

    const selId = parseInt(selIdStr);
    if (isNaN(selId)) { i++; continue; }

    const back: OddsPoint[] = [];
    const lay:  OddsPoint[] = [];

    for (let j = 0; j < 3; j++) {
      const price = parseFloat(parts[i + 2 + j * 2] ?? '');
      const size  = parseFloat(parts[i + 3 + j * 2] ?? '');
      if (!isNaN(price) && price > 0) back.push({ price, size: isNaN(size) ? 0 : size });
    }
    for (let j = 0; j < 3; j++) {
      const price = parseFloat(parts[i + 8 + j * 2] ?? '');
      const size  = parseFloat(parts[i + 9 + j * 2] ?? '');
      if (!isNaN(price) && price > 0) lay.push({ price, size: isNaN(size) ? 0 : size });
    }

    runners.push({ selectionId: selId, runnerName: '', back, lay });
    i += 14;
  }

  return { marketId, runners };
}

/**
 * Fetch live exchange odds for a batch of market IDs.
 * Returns a map of marketId → runners with back/lay prices.
 * Call from the browser; CORS is open (*).
 */
export async function fetchMarketOdds(marketIds: string[]): Promise<MarketOdds> {
  if (!marketIds.length) return {};
  try {
    const res = await fetch(ODDS_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ market_ids: marketIds }),
    });
    if (!res.ok) return {};
    const raw: (string | null)[] = await res.json();
    const result: MarketOdds = {};
    for (const line of raw) {
      if (!line) continue;
      const { marketId, runners } = parseMarketData(line);
      result[marketId] = runners;
    }
    return result;
  } catch {
    return {};
  }
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

/** Derive two runner stubs from a match name like "Team A v Team B". */
export function deriveRunners(eventName: string): Runner[] | undefined {
  const sep = / v | vs | vs\. | V /;
  const parts = eventName.split(sep);
  if (parts.length < 2) return undefined;
  return [
    { selectionId: -1, runnerName: parts[0].trim() },
    { selectionId: -2, runnerName: parts[1].trim() },
  ];
}

export function buildSidebarData(events: Event[]): SidebarData {
  const grouped: SidebarData = {};
  events.forEach(ev => {
    const sportId = String(ev.event_type_id);
    const compId  = String(ev.competition_id);
    if (!grouped[sportId]) grouped[sportId] = {};
    if (!grouped[sportId][compId]) {
      grouped[sportId][compId] = { name: ev.competition_name, matches: [] };
    }
    grouped[sportId][compId].matches.push(ev);
  });
  return grouped;
}

export function getEventsByType(events: Event[], typeId: number): Event[] {
  return events
    .filter(e => e.event_type_id === typeId && e.name !== e.competition_name)
    .map(e => ({
      ...e,
      runners: e.runners?.length ? e.runners : deriveRunners(e.name),
    }))
    .sort((a, b) => {
      // in-play first
      if ((b.in_play ?? 0) !== (a.in_play ?? 0)) return (b.in_play ?? 0) - (a.in_play ?? 0);
      // then Betfair markets (have live exchange odds) before provider=3
      const aB = String(a.market_id ?? '').startsWith('1.');
      const bB = String(b.market_id ?? '').startsWith('1.');
      if (aB !== bB) return aB ? -1 : 1;
      return 0;
    });
}

// ─── Aggregate page fetch (Server Component only) ────────────────────────────

export async function fetchAllPageData(): Promise<PageData> {
  const [menus, events, tigerConfig] = await Promise.all([
    fetchMenus(),
    fetchEvents(),
    fetchTigerConfig(),
  ]);

  const featured = events.filter(e => e.featured_event === 1).slice(0, 10);
  const featuredEvents = featured.length ? featured : events.slice(0, 10);

  return {
    menus,
    events,
    featuredEvents,
    sidebarData: buildSidebarData(events),
    tigerConfig,
  };
}
