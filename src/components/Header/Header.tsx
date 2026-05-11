"use client";

import { useState } from "react";
import type { Event } from "@/lib/types";

interface HeaderProps {
  featuredEvents: Event[];
  onToggleSidebar: () => void;
}

export default function Header({ featuredEvents, onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="container d-flex align-items-center">
        {/* Logo + Sidebar Toggle */}
        <div className="d-flex align-items-center justify-content-between">
          <a href="/home" className="logo d-flex align-items-center">
            <img
              alt=""
              className="img-fluid"
              src="https://speedcdn.io/assets/logos/reddybook.live.png"
            />
          </a>
          <i
            className="bi bi-list-nested toggle-sidebar-btn"
            onClick={onToggleSidebar}
          />
        </div>

        {/* Featured Events Marquee */}
        <div className="livematch">
          <span className="lm_icon">
            <img
              src="/assets/images/icon-popular.svg"
              className="img-fluid"
              style={{ width: 32 }}
              alt=""
            />
          </span>
          {/* @ts-ignore */}
          <marquee scrollamount="5" className="lm_datas">
            {featuredEvents.map((ev, i) => (
              <div key={i}>
                <b tabIndex={0}>{ev.name}</b>
              </div>
            ))}
          {/* @ts-ignore */}
          </marquee>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <form
            className="search-form d-flex align-items-center"
            method="POST"
            action="#"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search Events"
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" title="Search">
              <i className="bi bi-search" />
            </button>
          </form>
        </div>

        {/* Rules link */}
        <a href="javascript:void(0)" className="rules">
          rules
        </a>

        {/* Login / Signup */}
        <nav className="header-nav ms-auto">
          <ul className="d-flex">
            <li className="nav-item dropdown pe-3">
              <a type="button" className="btn-login" href="/signup">
                {" "}Signup{" "}
              </a>
              <a type="button" className="btn-login">
                {" "}Login{" "}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
