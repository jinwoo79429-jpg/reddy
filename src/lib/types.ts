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
}

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
