"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MiddleNav from "@/components/MiddleNav/MiddleNav";
import GameSlider from "@/components/Dashboard/GameSlider";
import BannerSwiper from "@/components/Dashboard/BannerSwiper";
import SportList from "@/components/Dashboard/SportList";
import CasinoSection from "@/components/Dashboard/CasinoSection";
import CasinoGameGrid from "@/components/Dashboard/CasinoGameGrid";
import {
  fetchMarketOdds,
  fetchCasino1,
  fetchCasinoI,
  fetchCasinoInt,
  POLL_LIST_MS,
} from "@/lib/api";
import type { PageData, Event, MarketOdds, CasinoGame } from "@/lib/types";

interface HomeClientProps extends PageData {
  cricketEvents: Event[];
  footballEvents: Event[];
  tennisEvents: Event[];
}

export default function HomeClient({
  menus,
  featuredEvents,
  sidebarData,
  tigerConfig,
  cricketEvents,
  footballEvents,
  tennisEvents,
}: HomeClientProps) {
  const handleToggleSidebar = useCallback(() => {
    document.body.classList.toggle("toggle-sidebar");
  }, []);

  // ── live odds (10 s polling — matches original site's listOddsData interval) ─
  const [marketOdds, setMarketOdds] = useState<MarketOdds>({});

  const allEvents = [...cricketEvents, ...footballEvents, ...tennisEvents];
  const marketIds = allEvents
    .map(e => e.market_id)
    .filter((id): id is string => Boolean(id))
    .slice(0, 30);

  useEffect(() => {
    if (!marketIds.length) return;
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      const odds = await fetchMarketOdds(marketIds);
      if (!cancelled) setMarketOdds(odds);
    };
    poll();
    const id = setInterval(poll, POLL_LIST_MS);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketIds.join(",")]);

  // ── casino sections fetched client-side (CF-cookie required) ─────────────
  const [casino1Games,   setCasino1Games]   = useState<CasinoGame[]>([]);
  const [casinoIGames,   setCasinoIGames]   = useState<CasinoGame[]>([]);
  const [casinoIntGames, setCasinoIntGames] = useState<CasinoGame[]>([]);

  useEffect(() => {
    fetchCasino1().then(setCasino1Games);
    fetchCasinoI().then(setCasinoIGames);
    fetchCasinoInt().then(setCasinoIntGames);
  }, []);

  const highlightGames   = tigerConfig?.highlight_casino ?? [];
  const newLaunchBanners = tigerConfig?.new_launch        ?? [];
  const providers        = tigerConfig?.our_provider       ?? [];

  return (
    <>
      <Header featuredEvents={featuredEvents} onToggleSidebar={handleToggleSidebar} />
      <Sidebar menus={menus} sidebarData={sidebarData} onToggleSidebar={handleToggleSidebar} />
      <MiddleNav menus={menus} activeSport="home" />

      <div className="ipl-loksabha">
        <a className="ipl" href="/sports/detail/28127348">
          <span className="blinker">IPL 2026</span>
        </a>
      </div>

      <main id="main" className="main">
        <section className="section listing_page">
          <div className="row">
            {/* Commentary marquee */}
            <div className="col-12 d-flex">
              <div className="commentary marquee">
                <img src="/assets/images/commentary.png" alt="commentary" />
                <span />
              </div>
            </div>

            <div className="col-lg-12 listing_page_12">
              <div className="middle-page-content home-page">

                {/* Popular games strip (mobile) */}
                {highlightGames.length > 0 && (
                  <div className="d-block d-md-none">
                    <GameSlider games={highlightGames} />
                  </div>
                )}

                {/* New launch banners (mobile) */}
                <div className="col-12 px-0 d-block d-md-none">
                  <h2 className="ipl">new launch</h2>
                </div>
                {newLaunchBanners.length > 0 && (
                  <div className="d-block d-md-none mb-2">
                    <BannerSwiper banners={newLaunchBanners} />
                  </div>
                )}

                {/* Sport event lists */}
                <div className="card mt-2">
                  {cricketEvents.length > 0 && (
                    <SportList
                      sportId={4}
                      sportName="Cricket"
                      events={cricketEvents}
                      marketOdds={marketOdds}
                    />
                  )}
                  {footballEvents.length > 0 && (
                    <SportList
                      sportId={1}
                      sportName="Football"
                      events={footballEvents}
                      marketOdds={marketOdds}
                    />
                  )}
                  {tennisEvents.length > 0 && (
                    <SportList
                      sportId={2}
                      sportName="Tennis"
                      events={tennisEvents}
                      marketOdds={marketOdds}
                    />
                  )}

                  {/* Casino providers strip from tiger_config */}
                  {providers.length > 0 && (
                    <CasinoSection providers={providers} />
                  )}
                </div>

                {/* Casino Type-1 (Indian casino — /api/guest/casino_1) */}
                {casino1Games.length > 0 && (
                  <CasinoGameGrid title="Casino" games={casino1Games} />
                )}

                {/* I-Casino (/api/guest/casino_i_list_new) */}
                {casinoIGames.length > 0 && (
                  <CasinoGameGrid title="I Casino" games={casinoIGames} />
                )}

                {/* International Casino (/api/guest/casino_int) */}
                {casinoIntGames.length > 0 && (
                  <CasinoGameGrid title="Int Casino" games={casinoIntGames} />
                )}

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
