import raw from "@/data/events.json";
import { slugify } from "./translit";

export type EventKind = "event" | "news" | "promo";

export interface EventItem {
  slug: string;
  kind: EventKind;
  day?: string;
  month?: string;
  meta?: string;
  title: string;
  excerpt?: string;
  body?: string[];
  linkLabel?: string;
  photoLabel?: string;
  image?: string;
}

export const events: EventItem[] = (raw.items as Omit<EventItem, "slug">[]).map((e) => ({
  ...e,
  kind: e.kind as EventKind,
  slug: slugify(e.title),
}));

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export const kindLabel: Record<EventKind, string> = { event: "Событие", news: "Новость", promo: "Акция" };

export const featured = {
  meta: "[дата], 19:00",
  title: "Грузинская супра с тамадой",
  text: "Большой стол, как в Грузии: тамада, тосты, живая музыка и сет из двенадцати блюд с вином. Места — только по брони.",
  price: "[цена] ₽ / гость",
  photoLabel: "Фото: вечер в Арго",
};
