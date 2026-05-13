import { fetchAllPageData } from "@/lib/api";
import EventDetailClient from "./EventDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const data = await fetchAllPageData();

  const event = data.events.find(
    (e) => String(e.event_id) === eventId || String(e.id) === eventId
  );

  if (!event) notFound();

  return <EventDetailClient {...data} event={event} />;
}
