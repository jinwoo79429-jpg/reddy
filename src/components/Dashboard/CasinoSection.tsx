import type { GameItem } from "@/lib/types";

interface CasinoSectionProps {
  providers: GameItem[];
}

export default function CasinoSection({ providers }: CasinoSectionProps) {
  if (!providers.length) return null;

  return (
    <div className="casinoprovider-thumb-section">
      {providers.map((p) => (
        <div className="cts-img popularDiv" key={p.id}>
          <img
            className="img-fluid"
            src={`https://speedcdn.io/${p.url_thumb}`}
            alt={p.name}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
