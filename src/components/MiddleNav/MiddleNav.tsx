import type { Menu } from "@/lib/types";

interface MiddleNavProps {
  menus: Menu[];
  activeSport?: string;
}

// Exact menu order from the original site (hardcoded + API-driven)
const NAV_ITEMS = [
  { id: "home001", href: "/home", img: "/assets/images/menu-home.png", label: "Home", staticId: "home001" },
  { id: "inplay001", href: "/inplay", img: "/assets/images/menu-inplay.png", label: "in-play", staticId: "inplay001" },
  { id: "4", href: "/sports/4", img: "/assets/images/events/menu-4.png", label: "Cricket" },
  { id: "1", href: "/sports/1", img: "/assets/images/events/menu-1.png", label: "Football" },
  { id: "2", href: "/sports/2", img: "/assets/images/events/menu-2.png", label: "Tennis" },
  { id: "979797", href: "javascript:void(0)", img: "/assets/images/events/menu-979797.png", label: "Fantasy 11", cls: "new-tag-menus", bold: true },
  { id: "969696", href: "javascript:void(0)", img: "/assets/images/events/menu-969696.png", label: "Cock Fight", bold: true },
  { id: "2378961", href: "/sports/2378961", img: "/assets/images/events/menu-2378961.png", label: "Politics" },
  { id: "99998", href: "/sports/99998", img: "/assets/images/events/menu-99998.png", label: "Casino", cls: "hightlight-menu" },
  { id: "99991", href: "javascript:void(0)", img: "/assets/images/events/menu-99991.png", label: "Sports book" },
  { id: "7", href: "/sports/7", img: "/assets/images/events/menu-7.png", label: "Horse Racing" },
  { id: "4339", href: "/sports/4339", img: "/assets/images/events/menu-4339.png", label: "Greyhound Racing" },
  { id: "99990", href: "/sports/99990", img: "/assets/images/events/menu-99990.png", label: "Binary" },
  { id: "99994", href: "/sports/99994", img: "/assets/images/events/menu-99994.png", label: "Kabaddi" },
  { id: "7522", href: "/sports/7522", img: "/assets/images/events/menu-7522.png", label: "Basketball" },
  { id: "7511", href: "/sports/7511", img: "/assets/images/events/menu-7511.png", label: "Baseball" },
  { id: "20", href: "/sports/20", img: "/assets/images/events/menu-20.png", label: "Table Tennis" },
  { id: "998917", href: "/sports/998917", img: "/assets/images/events/menu-998917.png", label: "Volleyball" },
  { id: "7524", href: "/sports/7524", img: "/assets/images/events/menu-7524.png", label: "Ice Hockey" },
  { id: "5", href: "/sports/5", img: "/assets/images/events/menu-5.png", label: "Rugby" },
  { id: "26420387", href: "/sports/26420387", img: "/assets/images/events/menu-26420387.png", label: "Mixed Martial Arts" },
  { id: "3503", href: "/sports/3503", img: "/assets/images/events/menu-3503.png", label: "Darts" },
  { id: "29", href: "/sports/29", img: "/assets/images/events/menu-29.png", label: "Futsal" },
  { id: "99997", href: "/sports/99997", img: "/assets/images/events/menu-99997.png", label: "Casino Vivo" },
];

export default function MiddleNav({ menus: _menus, activeSport }: MiddleNavProps) {
  return (
    <div className="new-middle-menus">
      <ul>
        {/* IPL blinker (mobile only) */}
        <li className="d-sm-none">
          <a href="/sports/detail/28127348" className="blinker">
            {" "}IPL 2026{" "}
          </a>
        </li>

        {NAV_ITEMS.map((item) => {
          const isActive = activeSport === "home"
            ? item.staticId === "home001"
            : activeSport === item.id;
          const cls = [item.cls || "", isActive ? "nmm-active" : ""].filter(Boolean).join(" ");

          return (
            <li className="nav-item" key={item.id} id={item.staticId ? undefined : `sport${item.id}`}>
              <a
                id={item.staticId}
                href={item.href}
                className={cls || undefined}
              >
                <img src={item.img} alt={item.label} />
                {item.bold ? <b>{item.label}</b> : ` ${item.label} `}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
