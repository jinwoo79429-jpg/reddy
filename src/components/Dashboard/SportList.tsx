"use client";

import { useState } from "react";
import type { Event, Runner, MarketOdds } from "@/lib/types";

interface SportListProps {
  sportId: number;
  sportName: string;
  events: Event[];
  marketOdds?: MarketOdds;
}

type FilterType = "live" | "virtual" | "premium";

function isVirtual(ev: Event): boolean {
  return (
    /[\u{1F300}-\u{1FAFF}]/u.test(ev.name) ||
    /(SRL|Simulated|Virtual)/i.test(ev.competition_name)
  );
}

function isPremium(ev: Event): boolean {
  return typeof ev.market_id === "string" && ev.market_id.startsWith("1.");
}

function formatDate(openDate?: string): string {
  if (!openDate) return "";
  try {
    const d = new Date(openDate);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

function formatTime(openDate?: string): string {
  if (!openDate) return "";
  try {
    const d = new Date(openDate);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
  } catch {
    return "";
  }
}

function OddsCell({ price, size }: { price?: number; size?: number }) {
  const p = price != null ? String(price) : "-";
  const s = size != null ? String(Number(size.toFixed(2))) : "-";
  return (
    <span className="d-block bet-button-price">
      {" "}{p}{" "}
      <em>{s}</em>
    </span>
  );
}

export default function SportList({ sportId, sportName, events, marketOdds }: SportListProps) {
  const [filters, setFilters] = useState<Set<FilterType>>(new Set());

  if (!events.length) return null;

  const toggleFilter = (f: FilterType) => {
    setFilters(prev => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  };

  // Apply active filters — if none selected, show all
  const displayed = filters.size === 0
    ? events
    : events.filter(ev => {
        if (filters.has("live") && ev.in_play) return true;
        if (filters.has("virtual") && isVirtual(ev)) return true;
        if (filters.has("premium") && isPremium(ev)) return true;
        return false;
      });

  const suffix = `${sportId}-home`;

  return (
    <div className="card-body card-content p-0">
      {/* Header */}
      <div className="bet-table-header">
        <div className="row align-items-center">
          <div className="col-md-6">
            <span className="list-sport-title">
              <img
                className="img-fluid game-icon-img"
                src={`/assets/images/events/menu-${sportId}.png`}
                alt={sportName}
              />
              {" "}{sportName}
            </span>
            <ul className="ks-cboxtags">
              {(["live", "virtual", "premium"] as FilterType[]).map((f, i) => (
                <li key={f}>
                  <input
                    type="checkbox"
                    id={`checkbox-${f}-${suffix}`}
                    checked={filters.has(f)}
                    onChange={() => toggleFilter(f)}
                  />
                  <label htmlFor={`checkbox-${f}-${suffix}`}>
                    {f.toUpperCase()}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-2 text-center d-none d-md-block"><small>1</small></div>
          <div className="col-md-2 text-center d-none d-md-block"><small>X</small></div>
          <div className="col-md-2 text-center d-none d-md-block"><small>2</small></div>
        </div>
      </div>

      {/* Rows */}
      <div className="bet-table-body">
        {displayed.slice(0, 10).map((ev) => {
          const liveRunners: Runner[] | undefined =
            ev.market_id && marketOdds?.[ev.market_id]
              ? marketOdds[ev.market_id]
              : ev.runners;

          const runners = liveRunners ?? [];
          const r0 = runners[0];
          const r1 = runners[1];
          const r2 = runners[2];
          const back0 = r0?.back?.[0];
          const lay0  = r0?.lay?.[0];
          const back1 = r1?.back?.[0];
          const lay1  = r1?.lay?.[0];
          const back2 = r2?.back?.[0];
          const lay2  = r2?.lay?.[0];

          return (
            <div className="bet-table-row" key={ev.event_id}>
              <div className="row">
                <div className="col-md-6">
                  <div className="game-box">
                    <div className="game-left-col">
                      <div className="game-name">
                        <a href={`/sports/detail/${ev.event_id}`}>
                          <p className="team-name text-left">{ev.name}{" "}</p>
                          <p className="team-name text-left team-event">({ev.competition_name})</p>
                        </a>
                      </div>
                      {ev.in_play ? (
                        <div className="game-date inplay"><span>Live</span></div>
                      ) : null}
                      <div className="game-date">
                        <p className="mb-0 day text-left">{formatDate(ev.open_date)}</p>
                        <p className="mb-0 day text-left">{formatTime(ev.open_date)}</p>
                      </div>
                    </div>
                    <div className="game-icons">
                      <div className="icon-tv">
                        <a href="javascript:void(0);">
                          <img src="/assets/images/fancy.svg" alt="" />
                        </a>
                        <a href="javascript:void(0);">
                          <img src="/assets/images/tv.svg" alt="" />
                        </a>
                        <span className="game-bm">BM</span>
                      </div>
                    </div>
                    <a href="javascript:void(0);" className="add-pin">
                      <i className="bi bi-pin" />
                    </a>
                  </div>
                </div>

                <div className="col-md-6 text-center">
                  <div className="row g-0">
                    {[
                      { back: back0, lay: lay0 },
                      { back: back1, lay: lay1 },
                      { back: back2, lay: lay2 },
                    ].map((col, i) => (
                      <div className="col-md-4 col-4" key={i}>
                        <div className="h-backLay">
                          <div className="back bl-box">
                            <OddsCell price={col.back?.price} size={col.back?.size} />
                          </div>
                          <div className="bl-box lay">
                            <OddsCell price={col.lay?.price} size={col.lay?.size} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {displayed.length === 0 && (
          <div className="text-center py-3 text-muted" style={{ fontSize: 13 }}>
            No events match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
