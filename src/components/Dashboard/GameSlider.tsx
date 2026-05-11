import type { GameItem } from "@/lib/types";

interface GameSliderProps {
  games: GameItem[];
}

export default function GameSlider({ games }: GameSliderProps) {
  return (
    <div className="game-slider mb-2">
      <div className="coupon-card">
        <div className="custom-thumb-section">
          {games.map((game) => (
            <div className="cts-img popularDiv hc_div" key={game.id}>
              <a href="javascript:void(0)">
                <img
                  className="img-fluid"
                  src={`https://speedcdn.io/${game.url_thumb}`}
                  alt={game.name}
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
