"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Button, Icon, IconButton, Logo } from "@/components/ds";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/menu";
import { nav, site } from "@/lib/site";
import { useUI } from "./ui-state";
import { useDialog } from "./useDialog";

function isActive(pathname: string, href: string, label: string) {
  if (href === "/") return pathname === "/";
  if (label === "Акции" || label === "Контакты") return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export function OrderButton({ dark, compact }: { dark?: boolean; compact?: boolean }) {
  const { count, total } = useCart();
  const { setCartOpen } = useUI();
  return (
    <button type="button" className={"order-btn" + (dark ? " is-dark" : "") + (count ? " has-items" : "") + (compact ? " is-compact" : "")} onClick={() => setCartOpen(true)} aria-label={count ? `Заказ: ${count}, на сумму ${formatPrice(total)}` : "Заказ: пока пусто"}>
      <Icon name="bag" size={18} />
      {!compact ? <span className="order-btn-label">Заказ</span> : null}
      {count ? (
        <span className="order-btn-count" aria-hidden>
          {compact ? count : `${count} · ${formatPrice(total)}`}
        </span>
      ) : null}
    </button>
  );
}

export function Header({ variant = "light", order }: { variant?: "light" | "dark"; order?: boolean }) {
  const pathname = usePathname();
  const dark = variant === "dark";
  const { setNavOpen } = useUI();

  return (
    <header className={"site-header" + (dark ? " is-dark" : " is-sticky")}>
      <div className="site-header-in">
        <Link href="/" className="logo-link" aria-label="Арго — на главную">
          <Logo tone={dark ? "light" : "ink"} className="logo-full" />
          <Logo tone={dark ? "light" : "ink"} tagline={false} className="logo-short" />
        </Link>
        <nav aria-label="Основное меню" className="main-nav">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className={isActive(pathname, n.href, n.label) ? "is-active" : undefined} aria-current={isActive(pathname, n.href, n.label) ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {order ? (
            <OrderButton dark={dark} />
          ) : (
            <a href={site.phoneHref} className="header-phone">
              <Icon name="phone" size={18} />
              <span>{site.phone}</span>
            </a>
          )}
          <Button variant="primary" icon="arrow-right" href="/#booking" className="header-book">
            Забронировать стол
          </Button>
          <div className="header-mobile">
            <OrderButton dark={dark} compact />
            <IconButton icon="menu" variant={dark ? "light" : "outline"} label="Открыть меню" onClick={() => setNavOpen(true)} className="burger" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  const { navOpen, setNavOpen } = useUI();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setNavOpen(false);
  useDialog(navOpen, close, ref);

  if (!navOpen) return null;
  return (
    <div className="overlay overlay-side" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="mnav" role="dialog" aria-modal="true" aria-label="Навигация" ref={ref} tabIndex={-1}>
        <div className="drawer-head">
          <Logo tagline={false} />
          <IconButton icon="close" variant="outline" label="Закрыть меню" onClick={close} />
        </div>
        <nav className="mnav-links" aria-label="Основное меню">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} onClick={close} className={isActive(pathname, n.href, n.label) ? "is-active" : undefined}>
              {n.label}
              <Icon name="arrow-right" size={20} />
            </Link>
          ))}
        </nav>
        <div className="mnav-foot">
          <a href={site.phoneHref} className="mnav-contact">
            <Icon name="phone" size={18} /> {site.phone}
          </a>
          <span className="mnav-contact muted">
            <Icon name="clock" size={18} /> {site.hours}
          </span>
          <Button variant="primary" size="lg" icon="arrow-right" href="/#booking" block onClick={close}>
            Забронировать стол
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Плавающая панель заказа снизу (телефон) */
export function MobileOrderBar() {
  const { count, total } = useCart();
  const { setCartOpen } = useUI();
  if (!count) return null;
  return (
    <button type="button" className="order-bar" onClick={() => setCartOpen(true)}>
      <span className="order-bar-text">
        <b>
          Заказ · {count} {count % 10 === 1 && count % 100 !== 11 ? "блюдо" : [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100) ? "блюда" : "блюд"}
        </b>
        <span>доставка или самовывоз</span>
      </span>
      <span className="order-bar-sum">
        {formatPrice(total)}
        <span className="ag-btn-disc">
          <Icon name="arrow-right" size={18} />
        </span>
      </span>
    </button>
  );
}
