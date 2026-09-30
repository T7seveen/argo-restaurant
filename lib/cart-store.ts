"use client";

import { useSyncExternalStore } from "react";
import { allDishes, getDish, type Dish } from "./menu";

/** Корзина: { slug: количество }, хранится в localStorage. */
export type CartState = Record<string, number>;

const KEY = "argo-cart-v1";
const EMPTY: CartState = {};
let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "{}") as CartState;
    const valid: CartState = {};
    for (const [slug, qty] of Object.entries(parsed)) {
      if (getDish(slug) && Number.isInteger(qty) && qty > 0) valid[slug] = Math.min(qty, 99);
    }
    state = valid;
  } catch {
    state = EMPTY;
  }
}

function emit(next: CartState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* приватный режим — живём без сохранения */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      listeners.forEach((fn) => fn());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  set(slug: string, qty: number) {
    load();
    const next = { ...state };
    if (qty <= 0) delete next[slug];
    else next[slug] = Math.min(qty, 99);
    emit(next);
  },
  add(slug: string, by = 1) {
    load();
    cart.set(slug, (state[slug] || 0) + by);
  },
  remove(slug: string) {
    load();
    cart.set(slug, (state[slug] || 0) - 1);
  },
  clear() {
    emit({});
  },
};

export function useCart() {
  const items = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => EMPTY,
  );
  const lines: { dish: Dish; qty: number }[] = allDishes.filter((d) => items[d.slug]).map((dish) => ({ dish, qty: items[dish.slug] }));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.dish.price, 0);
  return { items, lines, count, total };
}
