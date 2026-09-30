"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type UI = {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
};

const Ctx = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const value = useMemo(() => ({ cartOpen, setCartOpen, navOpen, setNavOpen }), [cartOpen, navOpen]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI вне UIProvider");
  return v;
}

/** Сколько записей истории добавила карточка блюда (чтобы закрытие вело «назад», а не плодило записи). */
export const dishHistory = { pushed: 0 };

/** Открыть карточку блюда поверх текущей страницы: ?dish=slug (кнопка «Назад» закрывает). */
export function useOpenDish() {
  return useCallback((slug: string) => {
    const url = new URL(window.location.href);
    const wasOpen = url.searchParams.has("dish");
    url.searchParams.set("dish", slug);
    const target = url.pathname + url.search + url.hash;
    if (wasOpen) {
      window.history.replaceState(null, "", target);
    } else {
      window.history.pushState(null, "", target);
      dishHistory.pushed = 1;
    }
  }, []);
}

export function closeDish() {
  if (dishHistory.pushed) {
    dishHistory.pushed = 0;
    window.history.back();
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("dish");
  window.history.replaceState(null, "", url.pathname + url.search + url.hash);
}
