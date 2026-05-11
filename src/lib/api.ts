import type { Menu, Event, TigerConfig, PageData, SidebarData, Runner, OddsPoint, MarketOdds } from './types';

const BASE_API = 'https://api.dcric99.com/api/guest';
const CDN_BASE = 'https://speedcdn.io';
const ODDS_API = 'https://odd.ocric99.com/ws/getMarketDataNew';

async function fetchJson<T>(url: string, opts?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 30 }, ...opts });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

export async function fetchMenus(): Promise<Menu[]> {
  const data = await fetchJson<{ data: { menu: Menu[] } }>(`${BASE_API}/menu`);
  return data?.data?.menu ?? [];
}

export async function fetchEvents(): Promise<Event[]> {
  const data = await fetchJson<{ data: { events: Event[] } }>(`${BASE_API}/event_list`);
  return data?.data?.events ?? [];
}

export async function fetchTigerConfig(): Promise<TigerConfig | null> {
  return fetchJson<TigerConfig>(`${CDN_BASE}/frontend_config/tiger/tiger_config.json`);
}

export function buildSidebarData(events: Event[]): SidebarData {
  const grouped: SidebarData = {};
  events.forEach(ev => {
    const sportId = String(ev.event_type_id);
    const compId = String(ev.competition_id);
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
    .sort((a, b) => (b.in_play ?? 0) - (a.in_play ?? 0));
}

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

// Parse pipe-delimited market data from odd.ocric99.com/ws/getMarketDataNew
// Format: market_id||STATUS|?|in_play|matched|?|?|sel_id|STATUS|b1p|b1s|b2p|b2s|b3p|b3s|l1p|l1s|l2p|l2s|l3p|l3s|sel_id|STATUS|...
export function parseMarketData(raw: string): { marketId: string; runners: Runner[] } {
  const parts = raw.split('|');
  const marketId = parts[0];
  const runners: Runner[] = [];

  // Header is 8 fields (0-7), runners start at index 8
  let i = 8;
  while (i < parts.length - 1) {
    const selIdStr = parts[i];
    const status = parts[i + 1];

    // Status words indicate a new runner block
    if (!['ACTIVE', 'SUSPENDED', 'REMOVED', 'WINNER', 'LOSER'].includes(status)) {
      i++;
      continue;
    }

    const selId = parseInt(selIdStr);
    if (isNaN(selId)) { i++; continue; }

    // Read 3 back and 3 lay price/size pairs (12 values)
    const back: OddsPoint[] = [];
    const lay: OddsPoint[] = [];

    for (let j = 0; j < 3; j++) {
      const price = parseFloat(parts[i + 2 + j * 2] ?? '');
      const size = parseFloat(parts[i + 3 + j * 2] ?? '');
      if (!isNaN(price) && price > 0) back.push({ price, size: isNaN(size) ? 0 : size });
    }
    for (let j = 0; j < 3; j++) {
      const price = parseFloat(parts[i + 8 + j * 2] ?? '');
      const size = parseFloat(parts[i + 9 + j * 2] ?? '');
      if (!isNaN(price) && price > 0) lay.push({ price, size: isNaN(size) ? 0 : size });
    }

    runners.push({ selectionId: selId, runnerName: '', back, lay });
    i += 14;
  }

  return { marketId, runners };
}

// Fetch live odds for a list of Betfair market IDs
// Called from the browser (CORS: * is allowed)
export async function fetchMarketOdds(marketIds: string[]): Promise<MarketOdds> {
  if (!marketIds.length) return {};
  try {
    const res = await fetch(ODDS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ market_ids: marketIds }),
    });
    if (!res.ok) return {};
    const raw: string[] = await res.json();
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
