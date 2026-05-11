import { fetchAllPageData, getEventsByType } from "@/lib/api";
import SportPageClient from "./SportPageClient";

export const dynamic = "force-dynamic";

const SPORT_NAMES: Record<string, string> = {
  "4": "Cricket",
  "1": "Football",
  "2": "Tennis",
  "7": "Horse Racing",
  "4339": "Greyhound Racing",
  "7522": "Basketball",
  "7511": "Baseball",
  "20": "Table Tennis",
  "998917": "Volleyball",
  "7524": "Ice Hockey",
  "5": "Rugby",
  "26420387": "Mixed Martial Arts",
  "3503": "Darts",
  "29": "Futsal",
};

export default async function SportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await fetchAllPageData();
  const typeId = parseInt(id);
  const events = isNaN(typeId) ? [] : getEventsByType(data.events, typeId);
  const sportName = SPORT_NAMES[id] ?? `Sport ${id}`;

  return (
    <SportPageClient
      {...data}
      sportId={typeId}
      sportName={sportName}
      events={events}
    />
  );
}
