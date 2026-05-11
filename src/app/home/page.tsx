import { fetchAllPageData, getEventsByType } from "@/lib/api";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await fetchAllPageData();

  const cricketEvents = getEventsByType(data.events, 4);
  const footballEvents = getEventsByType(data.events, 1);
  const tennisEvents = getEventsByType(data.events, 2);

  return (
    <HomeClient
      {...data}
      cricketEvents={cricketEvents}
      footballEvents={footballEvents}
      tennisEvents={tennisEvents}
    />
  );
}
