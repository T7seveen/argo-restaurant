import type { MetadataRoute } from "next";
import { events } from "@/lib/events";
import { allDishes } from "@/lib/menu";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  return [
    { url: base, priority: 1 },
    { url: `${base}/menu`, priority: 0.9 },
    { url: `${base}/about`, priority: 0.7 },
    { url: `${base}/events`, priority: 0.7 },
    ...allDishes.map((d) => ({ url: `${base}/menu/${d.slug}`, priority: 0.6 })),
    ...events.map((e) => ({ url: `${base}/events/${e.slug}`, priority: 0.5 })),
  ];
}
