import type { CasinoGame } from "@/lib/types";

interface CasinoGameGridProps {
  title: string;
  games: CasinoGame[];
}

const CDN = "https://speedcdn.io/";

export default function CasinoGameGrid({ title, games }: CasinoGameGridProps) {
  if (!games.length) return null;

  return (
    <div className="card mt-2">
      <div className="card-body card-content p-0">
        <div className="bet-table-header">
          <span className="list-sport-title">{title}</span>
        </div>
        <div className="casinoprovider-thumb-section p-2">
          {games.slice(0, 24).map((g) => {
            const thumb = g.url_thumb
              ? g.url_thumb.startsWith("http")
                ? g.url_thumb
                : CDN + g.url_thumb
              : "";
            return (
              <div className="cts-img popularDiv" key={g.id} title={g.name}>
                {thumb ? (
                  <img
                    className="img-fluid"
                    src={thumb}
                    alt={g.name}
                    loading="lazy"
                  />
                ) : (
                  <span style={{ fontSize: 10 }}>{g.name}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
