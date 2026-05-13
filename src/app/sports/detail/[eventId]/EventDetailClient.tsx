"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import MiddleNav from "@/components/MiddleNav/MiddleNav";
import {
  fetchMarketOdds,
  fetchEventDetail,
  deriveRunners,
  POLL_DETAIL_MS,
  SCORE_IFRAME_BASE,
} from "@/lib/api";
import type {
  PageData, Event, Runner, OddsPoint,
  EventDetail, DetailRunner,
} from "@/lib/types";

interface EventDetailClientProps extends PageData {
  event: Event;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function OddsBtn({
  price,
  size,
  type,
}: {
  price?: number;
  size?: number;
  type: "back" | "lay";
}) {
  const cls = type === "back" ? "back bl-box" : "bl-box lay";
  const p = price != null && price > 0 ? price : "-";
  const s = size  != null && size  > 0 ? Number(size.toFixed(2)) : "-";
  return (
    <div className={cls}>
      <span className="d-block bet-button-price">
        {" "}{p}{" "}<em>{s}</em>
      </span>
    </div>
  );
}

function RunnerRow({ runner, label }: { runner?: Runner; label: string }) {
  const back = runner?.back ?? [];
  const lay  = runner?.lay  ?? [];
  return (
    <div className="bet-table-row">
      <div className="row align-items-center">
        <div className="col-md-3 col-5">
          <p className="team-name text-left mb-0 px-2">{label}</p>
        </div>
        <div className="col-md-9 col-7">
          <div className="row g-0">
            {/* Back prices: show best 3 in descending order so highest is rightmost */}
            {[2, 1, 0].map(bi => (
              <div className="col-2" key={`b${bi}`}>
                <OddsBtn price={back[bi]?.price} size={back[bi]?.size} type="back" />
              </div>
            ))}
            {/* Lay prices: best first */}
            {[0, 1, 2].map(li => (
              <div className="col-2" key={`l${li}`}>
                <OddsBtn price={lay[li]?.price} size={lay[li]?.size} type="lay" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Convert DetailRunner (from /api/guest/event) to Runner shape
function detailToRunner(dr: DetailRunner): Runner {
  return {
    selectionId: dr.selection_id,
    runnerName:  dr.name,
    back: dr.ex?.availableToBack ?? [],
    lay:  dr.ex?.availableToLay  ?? [],
  };
}

// ─── main component ───────────────────────────────────────────────────────────

export default function EventDetailClient({
  menus,
  featuredEvents,
  sidebarData,
  event,
}: EventDetailClientProps) {
  const handleToggleSidebar = useCallback(() => {
    document.body.classList.toggle("toggle-sidebar");
  }, []);

  const isBetfair = String(event.market_id ?? "").startsWith("1.");

  // Derive name stubs from event name (used as fallback before API data loads)
  const nameStubs = event.runners?.length
    ? event.runners
    : deriveRunners(event.name) ?? [];

  const [runners, setRunners] = useState<Runner[]>(nameStubs);
  const [detail,  setDetail]  = useState<EventDetail | null>(null);

  // Step 1 — fetch full event detail from /api/guest/event (browser call, passes CF cookie)
  // This gives us runners with proper names and selection_id values.
  useEffect(() => {
    fetchEventDetail(event.event_id).then(d => {
      if (!d) return;
      setDetail(d);
      // Use the embedded exchange odds as the initial state if present
      if (d.runners?.length) {
        setRunners(d.runners.map(detailToRunner));
      }
    });
  }, [event.event_id]);

  // Step 2 — poll live odds every 600 ms and merge with runner names
  useEffect(() => {
    if (!event.market_id || !isBetfair) return;

    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      const odds = await fetchMarketOdds([event.market_id!]);
      const liveRunners = odds[event.market_id!];
      if (!cancelled && liveRunners) {
        setRunners(prev =>
          liveRunners.map((lr, i) => ({
            ...lr,
            // preserve runner name from detail API or name stubs
            runnerName: prev[i]?.runnerName || nameStubs[i]?.runnerName || `Runner ${i + 1}`,
          }))
        );
      }
    };

    poll();
    const id = setInterval(poll, POLL_DETAIL_MS);
    return () => { cancelled = true; clearInterval(id); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.market_id, isBetfair]);

  // ── runner layout ──────────────────────────────────────────────────────────
  const isFootball = event.event_type_id === 1;

  const teamA   = runners[0];
  const drawR   = isFootball ? runners[1] : undefined;
  const teamB   = isFootball ? runners[2] : runners[1];

  const teamALabel = teamA?.runnerName || nameStubs[0]?.runnerName || "Team A";
  const teamBLabel = teamB?.runnerName
    || nameStubs[isFootball ? 2 : 1]?.runnerName
    || "Team B";

  // bm_active / fancy_active: prefer detail data, fall back to event
  const bmActive     = detail?.bm_active    ?? event.bm_active;
  const fancyActive  = detail?.fancy_active ?? event.fancy_active;
  const tvChannel    = detail?.tv_channel   ?? event.tv_channel;

  return (
    <>
      <Header featuredEvents={featuredEvents} onToggleSidebar={handleToggleSidebar} />
      <Sidebar menus={menus} sidebarData={sidebarData} onToggleSidebar={handleToggleSidebar} />
      <MiddleNav menus={menus} activeSport={String(event.event_type_id)} />

      <main id="main" className="main">
        <section className="section listing_page">
          <div className="row">
            <div className="col-lg-12 listing_page_12">
              <div className="middle-page-content">

                {/* Event header */}
                <div className="card mt-2 mb-2">
                  <div className="card-body p-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      {event.in_play ? (
                        <span className="badge bg-danger">LIVE</span>
                      ) : null}
                      <span className="fw-bold">{event.name}</span>
                      <small className="text-muted">— {event.competition_name}</small>
                      {tvChannel && (
                        <img
                          src="/assets/images/tv.svg"
                          alt="tv"
                          style={{ width: 18 }}
                        />
                      )}
                      {bmActive    ? <span className="game-bm ms-auto">BM</span>    : null}
                      {fancyActive ? <span className="game-bm">FANCY</span> : null}
                    </div>
                  </div>
                </div>

                {/* Score iframe — only for live events */}
                {event.in_play ? (
                  <div className="card mb-2">
                    <div className="card-body p-0" style={{ height: 180, overflow: "hidden" }}>
                      <iframe
                        src={`${SCORE_IFRAME_BASE}${event.event_id}`}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        title="Live Score"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </div>
                ) : null}

                {/* Match Odds */}
                <div className="card">
                  <div className="card-body card-content p-0">
                    {/* Header */}
                    <div className="bet-table-header">
                      <div className="row align-items-center">
                        <div className="col-md-3 col-5">
                          <span className="list-sport-title">Match Odds</span>
                        </div>
                        <div className="col-md-9 col-7">
                          <div className="row g-0 text-center">
                            <div className="col-6">
                              <small>Back</small>
                            </div>
                            <div className="col-6">
                              <small>Lay</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bet-table-body">
                      <RunnerRow runner={teamA} label={teamALabel} />
                      {isFootball && (
                        <RunnerRow runner={drawR} label="Draw" />
                      )}
                      <RunnerRow runner={teamB} label={teamBLabel} />
                    </div>

                    {!isBetfair && (
                      <div className="text-center py-2 text-muted" style={{ fontSize: 12 }}>
                        Live exchange odds not available for this market.
                      </div>
                    )}
                  </div>
                </div>

                {/* Bookmaker — shown when event has bm_active */}
                {bmActive ? (
                  <div className="card mt-2">
                    <div className="card-body card-content p-0">
                      <div className="bet-table-header">
                        <span className="list-sport-title">Bookmaker</span>
                      </div>
                      {detail?.book_maker_odds?.length ? (
                        <div className="bet-table-body">
                          {detail.book_maker_odds.map((bm, idx) => {
                            const bmRunner: Runner = {
                              selectionId: bm.selection_id,
                              runnerName:  bm.name,
                              back: bm.back0 ? [{ price: bm.back0, size: bm.back0_volume }] : [],
                              lay:  bm.lay0  ? [{ price: bm.lay0,  size: bm.lay0_volume  }] : [],
                            };
                            return <RunnerRow key={idx} runner={bmRunner} label={bm.name} />;
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-3 text-muted" style={{ fontSize: 12 }}>
                          Bookmaker odds require an account session.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Fancy bets — shown when event has fancy_active */}
                {fancyActive ? (
                  <div className="card mt-2">
                    <div className="card-body card-content p-0">
                      <div className="bet-table-header">
                        <span className="list-sport-title">Fancy Bets</span>
                      </div>
                      {detail?.fancy?.length ? (
                        <div className="bet-table-body">
                          {detail.fancy.map((fb, idx) => (
                            <div className="bet-table-row" key={idx}>
                              <div className="row align-items-center">
                                <div className="col-md-4 col-6">
                                  <p className="team-name text-left mb-0 px-2">{fb.name}</p>
                                </div>
                                <div className="col-md-8 col-6">
                                  <div className="row g-0">
                                    <div className="col-6">
                                      <div className="back bl-box">
                                        <span className="d-block bet-button-price">
                                          {fb.back0_price || "-"} <em>{fb.back0_rate || "-"}</em>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="bl-box lay">
                                        <span className="d-block bet-button-price">
                                          {fb.lay0_price || "-"} <em>{fb.lay0_rate || "-"}</em>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-3 text-muted" style={{ fontSize: 12 }}>
                          Fancy bets require an account session.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
