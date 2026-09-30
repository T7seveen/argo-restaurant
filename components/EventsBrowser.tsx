"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { EventCard, FilterChip } from "@/components/ds";
import { events, type EventKind } from "@/lib/events";

const TABS: { id: "" | EventKind; label: string }[] = [
  { id: "", label: "Все" },
  { id: "event", label: "События" },
  { id: "news", label: "Новости" },
  { id: "promo", label: "Акции" },
];

export function EventsTabs({ title, featured }: { title: ReactNode; featured: ReactNode }) {
  const sp = useSearchParams();
  const t = sp.get("tab");
  return <EventsView tab={t === "event" || t === "news" || t === "promo" ? t : ""} interactive title={title} featured={featured} />;
}

export function EventsStatic({ title, featured }: { title: ReactNode; featured: ReactNode }) {
  return <EventsView tab="" title={title} featured={featured} />;
}

function EventsView({ tab, interactive, title, featured }: { tab: "" | EventKind; interactive?: boolean; title: ReactNode; featured: ReactNode }) {
  const list = tab ? events.filter((e) => e.kind === tab) : events;
  const set = (id: string) => {
    if (!interactive) return;
    window.history.replaceState(null, "", "/events" + (id ? "?tab=" + id : ""));
  };
  return (
    <>
      <div className="events-head">
      {title}
      <div className="events-tabs" role="group" aria-label="Что показать">
        {TABS.map((t) => (
          <FilterChip key={t.id} selected={tab === t.id} count={t.id ? events.filter((e) => e.kind === t.id).length : events.length} onClick={() => set(t.id)}>
            {t.label}
          </FilterChip>
        ))}
      </div>
      </div>
      {!tab || tab === "event" ? featured : null}
      <div className="grid-3 events-grid" aria-live="polite">
        {list.map((e) => (
          <EventCard key={e.slug} kind={e.kind} day={e.day} month={e.month} meta={e.meta} title={e.title} excerpt={e.excerpt} photoLabel={e.photoLabel} linkLabel={e.linkLabel} href={`/events/${e.slug}`} />
        ))}
      </div>
    </>
  );
}
