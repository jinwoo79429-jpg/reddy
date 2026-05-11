"use client";

import { useEffect, useRef } from "react";
import type { GameItem } from "@/lib/types";

interface BannerSwiperProps {
  banners: GameItem[];
}

export default function BannerSwiper({ banners }: BannerSwiperProps) {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = () => {
      if (typeof window !== "undefined" && (window as any).Swiper && swiperRef.current) {
        new (window as any).Swiper(swiperRef.current, {
          loop: true,
          autoplay: { delay: 3000, disableOnInteraction: false },
          pagination: { el: ".swiper-pagination", clickable: true },
          slidesPerView: 1,
        });
      }
    };

    if ((window as any).Swiper) {
      init();
    } else {
      const t = setInterval(() => {
        if ((window as any).Swiper) { init(); clearInterval(t); }
      }, 200);
      return () => clearInterval(t);
    }
  }, []);

  return (
    <div className="swiper top-baner mySwiper" ref={swiperRef}>
      <div className="swiper-wrapper">
        {banners.map((b, i) => (
          <div className="swiper-slide slider_banner__item" key={i}>
            <img
              alt={b.name}
              className="img-fluid slider_banner__item_img w-100"
              src={`https://speedcdn.io/${b.url_thumb}`}
            />
          </div>
        ))}
      </div>
      <div className="swiper-pagination" />
    </div>
  );
}
