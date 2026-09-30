"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useRef, type ReactNode } from "react";
import { Button, FilterChip, Icon, Ornament } from "@/components/ds";
import { categories, plural, type Dish } from "@/lib/menu";
import { DishCard } from "./DishCard";

export type MenuFilters = { cat: string; q: string; veg: boolean; spicy: boolean; hit: boolean };
const DEFAULTS: MenuFilters = { cat: "", q: "", veg: false, spicy: false, hit: false };

function norm(s: string) {
  return s.toLowerCase().replace(/ё/g, "е").trim();
}

function matches(d: Dish, f: MenuFilters) {
  if (f.veg && !d.badges.includes("veg")) return false;
  if (f.spicy && !d.badges.includes("spicy")) return false;
  if (f.hit && !(d.badges.includes("hit") || d.badges.includes("chef"))) return false;
  if (f.q) {
    const hay = norm(d.name + " " + (d.description || "") + " " + (d.composition || ""));
    return norm(f.q)
      .split(/\s+/)
      .every((w) => hay.includes(w));
  }
  return true;
}

/** Состояние фильтров живёт в URL: /menu?cat=khinkali&veg=1&q=сыр */
export function MenuBrowser({ head }: { head: ReactNode }) {
  const sp = useSearchParams();
  const f: MenuFilters = {
    cat: categories.some((c) => c.id === sp.get("cat")) ? sp.get("cat")! : "",
    q: sp.get("q") || "",
    veg: sp.get("veg") === "1",
    spicy: sp.get("spicy") === "1",
    hit: sp.get("hit") === "1",
  };
  const update = (patch: Partial<MenuFilters>) => {
    const next = { ...f, ...patch };
    const p = new URLSearchParams();
    if (next.cat) p.set("cat", next.cat);
    if (next.q) p.set("q", next.q);
    if (next.veg) p.set("veg", "1");
    if (next.spicy) p.set("spicy", "1");
    if (next.hit) p.set("hit", "1");
    const dish = sp.get("dish");
    if (dish) p.set("dish", dish);
    const qs = p.toString();
    window.history.replaceState(null, "", "/menu" + (qs ? "?" + qs : ""));
  };
  return <MenuView f={f} update={update} head={head} />;
}

export function MenuStatic({ head }: { head: ReactNode }) {
  return <MenuView f={DEFAULTS} update={() => {}} head={head} />;
}

function MenuView({ f, update, head }: { f: MenuFilters; update: (p: Partial<MenuFilters>) => void; head: ReactNode }) {
  const topRef = useRef<HTMLDivElement>(null);

  // Счётчики на чипах категорий учитывают поиск и свойства
  const filteredByProps = useMemo(() => categories.map((c) => ({ ...c, dishes: c.dishes.filter((d) => matches(d, f)) })), [f.q, f.veg, f.spicy, f.hit]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = filteredByProps.reduce((s, c) => s + c.dishes.length, 0);
  const sections = filteredByProps.filter((c) => (!f.cat || c.id === f.cat) && c.dishes.length);
  const found = sections.reduce((s, c) => s + c.dishes.length, 0);
  const dirty = f.cat || f.q || f.veg || f.spicy || f.hit;

  function pickCat(id: string) {
    update({ cat: id });
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="menu-head">
      {head}
      <div className="menu-search">
        <Icon name="search" size={20} />
        <input type="search" placeholder="Хинкали, харчо, саперави…" aria-label="Поиск по меню" value={f.q} onChange={(e) => update({ q: e.target.value })} />
        {f.q ? (
          <button type="button" className="menu-search-clear" aria-label="Очистить поиск" onClick={() => update({ q: "" })}>
            <Icon name="close" size={18} />
          </button>
        ) : null}
      </div>
      </div>
      <div ref={topRef} className="menu-anchor" />
      <div className="filters">
        <div className="filters-cats" role="group" aria-label="Категории">
          <FilterChip selected={!f.cat} count={total} onClick={() => pickCat("")}>
            Всё меню
          </FilterChip>
          {filteredByProps.map((c) => (
            <FilterChip key={c.id} selected={f.cat === c.id} count={c.dishes.length} onClick={() => pickCat(f.cat === c.id ? "" : c.id)}>
              {c.title}
            </FilterChip>
          ))}
        </div>
        <div className="filters-row">
          <div className="filters-props" role="group" aria-label="Свойства">
            <FilterChip icon="leaf" selected={f.veg} onClick={() => update({ veg: !f.veg })}>
              Без мяса
            </FilterChip>
            <FilterChip icon="fire" selected={f.spicy} onClick={() => update({ spicy: !f.spicy })}>
              Острое
            </FilterChip>
            <FilterChip icon="star" selected={f.hit} onClick={() => update({ hit: !f.hit })}>
              Хиты и выбор шефа
            </FilterChip>
          </div>
          <div className="filters-found" aria-live="polite">
            Найдено: <b>{found}</b>
          </div>
        </div>
      </div>

      {sections.length ? (
        sections.map((c) => (
          <section key={c.id} className="menu-section" id={c.id} aria-labelledby={`sec-${c.id}`}>
            <div className="menu-section-head">
              <h2 id={`sec-${c.id}`} className="display-m">
                {c.title}
              </h2>
              <span className="muted small">
                {c.dishes.length} {plural(c.dishes.length, "позиция", "позиции", "позиций")}
              </span>
            </div>
            <div className="dish-grid">
              {c.dishes.map((d) => (
                <DishCard key={d.slug} dish={d} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="menu-empty">
          <Ornament size={96} className="accent-orn" />
          <h2 className="display-m">Такого блюда пока нет</h2>
          <p className="muted">Попробуйте другое название или уберите часть фильтров.</p>
          {dirty ? (
            <Button variant="primary" icon="arrow-right" onClick={() => update({ ...DEFAULTS })}>
              Сбросить фильтры
            </Button>
          ) : null}
        </div>
      )}
    </>
  );
}
