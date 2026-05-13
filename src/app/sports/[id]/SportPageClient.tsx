"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MiddleNav from "@/components/MiddleNav/MiddleNav";
import SportList from "@/components/Dashboard/SportList";
import { fetchMarketOdds, POLL_LIST_MS } from "@/lib/api";
import type { PageData, Event, MarketOdds } from "@/lib/types";

interface SportPageClientProps extends PageData {
  sportId: number;
  sportName: string;
  events: Event[];
}

export default function SportPageClient({
  menus,
  featuredEvents,
  sidebarData,
  tigerConfig,
  sportId,
  sportName,
  events,
}: SportPageClientProps) {
  const handleToggleSidebar = useCallback(() => {
    document.body.classList.toggle("toggle-sidebar");
  }, []);

  const [marketOdds, setMarketOdds] = useState<MarketOdds>({});

  const marketIds = events
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
    const interval = setInterval(poll, POLL_LIST_MS);
    return () => { cancelled = true; clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketIds.join(",")]);

  return (
    <>
      <Header featuredEvents={featuredEvents} onToggleSidebar={handleToggleSidebar} />
      <Sidebar menus={menus} sidebarData={sidebarData} onToggleSidebar={handleToggleSidebar} />
      <MiddleNav menus={menus} activeSport={String(sportId)} />

      <main id="main" className="main">
        <section className="section listing_page">
          <div className="row">
            <div className="col-12 d-flex">
              <div className="commentary marquee">
                <img src="/assets/images/commentary.png" alt="commentary" />
                <span />
              </div>
            </div>
            <div className="col-lg-12 listing_page_12">
              <div className="middle-page-content home-page">
                <div className="card mt-2">
                  {events.length > 0 ? (
                    <SportList
                      sportId={sportId}
                      sportName={sportName}
                      events={events}
                      marketOdds={marketOdds}
                    />
                  ) : (
                    <div className="card-body text-center py-5 text-muted">
                      No events available for {sportName}.
                    </div>
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
