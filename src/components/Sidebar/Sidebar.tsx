"use client";

import type { SidebarData } from "@/lib/types";

interface SidebarProps {
  menus: unknown[];
  sidebarData: SidebarData;
  onToggleSidebar: () => void;
}

// Exact sidebar menu order from the original site
const SIDEBAR_ITEMS = [
  { id: 4,         name: "Cricket",          img: "menu-4.png",         expandable: true,  defaultOpen: true },
  { id: 1,         name: "Football",         img: "menu-1.png",         expandable: true },
  { id: 2,         name: "Tennis",           img: "menu-2.png",         expandable: true },
  { id: 979797,    name: "Fantasy 11",       img: "menu-979797.png",    expandable: false, cls: "nav-link final-link new-tag-menus" },
  { id: 969696,    name: "Cock Fight",       img: "menu-969696.png",    expandable: false, cls: "nav-link final-link" },
  { id: 2378961,   name: "Politics",         img: "menu-2378961.png",   expandable: true },
  { id: 99998,     name: "Casino",           img: "menu-99998.png",     expandable: false, cls: "nav-link final-link hightlight-smenu" },
  { id: 99991,     name: "Sports book",      img: "menu-99991.png",     expandable: false, cls: "nav-link final-link" },
  { id: 7,         name: "Horse Racing",     img: "menu-7.png",         expandable: true },
  { id: 4339,      name: "Greyhound Racing", img: "menu-4339.png",      expandable: true },
  { id: 99990,     name: "Binary",           img: "menu-99990.png",     expandable: true },
  { id: 99994,     name: "Kabaddi",          img: "menu-99994.png",     expandable: true },
  { id: 7522,      name: "Basketball",       img: "menu-7522.png",      expandable: true },
  { id: 7511,      name: "Baseball",         img: "menu-7511.png",      expandable: true },
  { id: 20,        name: "Table Tennis",     img: "menu-20.png",        expandable: true },
  { id: 998917,    name: "Volleyball",       img: "menu-998917.png",    expandable: true },
  { id: 7524,      name: "Ice Hockey",       img: "menu-7524.png",      expandable: true },
  { id: 5,         name: "Rugby",            img: "menu-5.png",         expandable: true },
  { id: 26420387,  name: "Mixed Martial Arts", img: "menu-26420387.png", expandable: true },
  { id: 3503,      name: "Darts",            img: "menu-3503.png",      expandable: true },
  { id: 29,        name: "Futsal",           img: "menu-29.png",        expandable: true },
];

export default function Sidebar({ menus: _menus, sidebarData, onToggleSidebar }: SidebarProps) {
  return (
    <aside id="sidebar" className="sidebar">
      <ul id="sidebar-nav" className="sidebar-nav">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="mobile-logo"
          src="https://speedcdn.io/assets/logos/reddybook.live.png"
          alt="logo"
        />
        <i
          className="bi bi-list-nested toggle-sidebar-btn"
          onClick={onToggleSidebar}
        />

        {SIDEBAR_ITEMS.map((item, sportIdx) => {
          const imgSrc = `/assets/images/events/${item.img}`;

          if (!item.expandable) {
            return (
              <li className="nav-item" key={item.id}>
                <a href="javascript:void(0)" className={item.cls || "nav-link final-link"}>
                  <img src={imgSrc} alt={item.name} />
                  <span>{item.name}</span>
                </a>
              </li>
            );
          }

          const sportEvents = sidebarData[String(item.id)] || {};
          const competitions = Object.entries(sportEvents);
          const collapseId = `collapse${sportIdx}`;
          const isOpen = item.defaultOpen;

          return (
            <li className="nav-item" key={item.id}>
              <a
                data-bs-toggle="collapse"
                className={`nav-link${isOpen ? "" : " collapsed"}`}
                href={`#${collapseId}`}
              >
                <img src={imgSrc} alt={item.name} />
                <span>{item.name}</span>
                <i className="bi bi-caret-down ms-auto" />
              </a>

              <ul
                className={`nav-content collapse${isOpen ? " show" : ""}`}
                id={collapseId}
              >
                {competitions.map(([compId, comp]: [string, any], compIdx) => {
                  const subId = `collapse${sportIdx}${compIdx}`;
                  return (
                    <li key={compId}>
                      <a data-bs-toggle="collapse" href={`#${subId}`}>
                        <span>{comp.name}</span>
                        <i className="bi bi-caret-down ms-auto" />
                      </a>
                      <div className="collapse" id={subId}>
                        <ul className="nav-second-level">
                          {comp.matches.map((match: any, mIdx: number) => (
                            <li key={mIdx}>
                              <a href="javascript:void(0);" className="final-link">
                                <span>{match.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}

        {/* Rules link at bottom */}
        <li className="nav-item">
          <a href="javascript:void(0)" className="nav-link final-link">
            <img src="/assets/images/menu-rules.png" alt="Rules" />
            <span>rules</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
