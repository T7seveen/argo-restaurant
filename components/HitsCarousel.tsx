"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconButton } from "@/components/ds";
import type { Dish } from "@/lib/menu";
import { DishCard } from "./DishCard";

export function HitsCarousel({ dishes, header }: { dishes: Dish[]; header: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function go(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section className="section" aria-labelledby="hits-title">
      <div className="section-head">
        {header}
        <div className="carousel-arrows">
          <IconButton icon="arrow-left" variant="outline" label="Предыдущие блюда" onClick={() => go(-1)} disabled={edge.start} />
          <IconButton icon="arrow-right" variant="terracotta" label="Следующие блюда" onClick={() => go(1)} disabled={edge.end} />
        </div>
      </div>
      <div className="carousel" ref={track}>
        {dishes.map((d) => (
          <DishCard key={d.slug} dish={d} className="carousel-item" />
        ))}
      </div>
    </section>
  );
}
