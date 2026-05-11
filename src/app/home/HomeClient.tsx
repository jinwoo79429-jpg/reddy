"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MiddleNav from "@/components/MiddleNav/MiddleNav";
import GameSlider from "@/components/Dashboard/GameSlider";
import BannerSwiper from "@/components/Dashboard/BannerSwiper";
import SportList from "@/components/Dashboard/SportList";
import CasinoSection from "@/components/Dashboard/CasinoSection";
import { fetchMarketOdds } from "@/lib/api";
import type { PageData, Event, MarketOdds } from "@/lib/types";

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

  const [marketOdds, setMarketOdds] = useState<MarketOdds>({});

  // Collect all market IDs from visible events
  const allEvents = [...cricketEvents, ...footballEvents, ...tennisEvents];
  const marketIds = allEvents
    .map(e => e.market_id)
    .filter((id): id is string => Boolean(id))
    .slice(0, 30); // limit to 30 markets per poll

  // Poll live odds every 3 seconds
  useEffect(() => {
    if (!marketIds.length) return;

    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      const odds = await fetchMarketOdds(marketIds);
      if (!cancelled) setMarketOdds(odds);
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketIds.join(',')]);

  const highlightGames = tigerConfig?.highlight_casino ?? [];
  const newLaunchBanners = tigerConfig?.new_launch ?? [];
  const providers = tigerConfig?.our_provider ?? [];

  return (
    <>
      <Header
        featuredEvents={featuredEvents}
        onToggleSidebar={handleToggleSidebar}
      />

      <Sidebar
        menus={menus}
        sidebarData={sidebarData}
        onToggleSidebar={handleToggleSidebar}
      />

      <MiddleNav menus={menus} activeSport="home" />

      <div className="ipl-loksabha">
        <a className="ipl" href="/sports/detail/28127348">
          <span className="blinker">IPL 2026</span>
        </a>
      </div>

      {/* Main Content */}
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
                {/* Popular games strip (mobile only) */}
                {highlightGames.length > 0 && (
                  <div className="d-block d-md-none">
                    <GameSlider games={highlightGames} />
                  </div>
                )}

                {/* New launch label (mobile only) */}
                <div className="col-12 px-0 d-block d-md-none">
                  <h2 className="ipl">new launch</h2>
                </div>

                {/* Banner swiper (mobile only) */}
                {newLaunchBanners.length > 0 && (
                  <div className="d-block d-md-none mb-2">
                    <BannerSwiper banners={newLaunchBanners} />
                  </div>
                )}

                {/* Sport tabs card */}
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

                  {providers.length > 0 && (
                    <CasinoSection providers={providers} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
