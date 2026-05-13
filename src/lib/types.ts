export interface Menu {
  id: number;
  name: string;
  url?: string;
  type?: string;
}

export interface Event {
  id: number;
  event_id: number;
  name: string;
  competition_name: string;
  competition_id: number;
  event_type_id: number;
  in_play: number;
  featured_event: number;
  open_date?: string;
  market_id?: string;
  runners?: Runner[];
  provider?: number;
  bm_active?: number;
  fancy_active?: number;
  tv_channel?: string | null;
  bet_allow?: number;
  shortcut_event?: number;
}

// Runner stub used before live odds load (derived from event name or event detail API)
export interface Runner {
  selectionId: number;
  runnerName: string;
  back?: OddsPoint[];
  lay?: OddsPoint[];
}

export interface OddsPoint {
  price: number;
  size: number;
}

// Full runner from /api/guest/event — has proper name + selection_id + embedded exchange odds
export interface DetailRunner {
  name: string;
  selection_id: number;
  ex?: {
    availableToBack: OddsPoint[];
    availableToLay: OddsPoint[];
  };
  status?: string;
}

export interface BookmakerRunner {
  name: string;
  selection_id: number;
  back0: number;
  back0_volume: number;
  lay0: number;
  lay0_volume: number;
  back1?: number;
  back1_volume?: number;
  lay1?: number;
  lay1_volume?: number;
  status?: string;
}

export interface FancyBet {
  name: string;
  selection_id: number;
  back0_price: number;
  back0_rate: number;
  lay0_price: number;
  lay0_rate: number;
  fancy_type?: string;
  status?: string;
}

// Response from /api/guest/event?event_id=X
export interface EventDetail {
  event_id: number;
  name: string;
  market_id: string;
  competition_name: string;
  event_type_id: number;
  in_play: number;
  runners: DetailRunner[];
  book_maker_odds?: BookmakerRunner[];
  fancy?: FancyBet[];
  min_bet?: number;
  max_bet?: number;
  tv_channel?: string | null;
  bm_active?: number;
  fancy_active?: number;
}

// Casino game from /api/guest/casino_* endpoints
export interface CasinoGame {
  id: string;
  name: string;
  image?: string;
  url_thumb?: string;
  product?: string;
  category?: string;
  game_type?: string;
  redirect_type?: string;
  category_id?: string;
}

export interface TigerConfig {
  new_launch: GameItem[];
  our_provider: GameItem[];
  highlight_casino: GameItem[];
}

export interface GameItem {
  id: string;
  name: string;
  product: string;
  category: string;
  url_thumb: string;
  game_type: string;
  category_id: string;
  redirect_type: string;
}

export interface SidebarCompetition {
  name: string;
  matches: Event[];
}

export interface SidebarSport {
  [competitionId: string]: SidebarCompetition;
}

export interface SidebarData {
  [sportId: string]: SidebarSport;
}

export interface PageData {
  menus: Menu[];
  events: Event[];
  featuredEvents: Event[];
  sidebarData: SidebarData;
  tigerConfig: TigerConfig | null;
}

export interface MarketOdds {
  [marketId: string]: Runner[];
}
