/* Арго — дизайн-система. Перенос design-system/components/bundle.js 1:1 (разметка, классы ag-*, поведение). */
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { BadgeTone, Tone } from "@/lib/menu";

function cx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

/* ---------- Icon ---------- */
const P = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  play: "M8 5.5v13l11-6.5z",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  phone: "M5 4h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6 6l1.5-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4z",
  leaf: "M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8",
  chili: "M8 7c-3 3-4 9-2 12 5-1 11-6 12-11-2-2-7-3-10-1zM15 5c0-1.5 1-2.5 2.5-2.5",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z",
  calendar: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8 3v4M16 3v4",
  bag: "M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8",
  menu: "M4 7h16M4 12h16M4 17h10",
  close: "M6 6l12 12M18 6 6 18",
  filter: "M4 6h16M7 12h10M10 18h4",
  wine: "M8 3h8l-.5 6a3.5 3.5 0 0 1-7 0zM12 12.5V20M8.5 20h7",
  fire: "M12 21c-4 0-6.5-2.6-6.5-6 0-4 3.5-5.5 3.5-10 3 1.5 4.5 4 4.5 6 1-.8 1.5-2 1.5-3 2 1.5 3.5 4 3.5 7 0 3.4-2.5 6-6.5 6z",
  heart: "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.5 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
  check: "M5 12.5l4.5 4.5L19 7.5",
};
export type IconName = keyof typeof P;

export function Icon({ name, size = 20, strokeWidth = 1.75, label, className }: { name: IconName; size?: number; strokeWidth?: number; label?: string; className?: string }) {
  return (
    <svg
      className={cx("ag-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={name === "play" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <path d={P[name] || P.plus} />
    </svg>
  );
}

/* ---------- Ornament: семилучевой вихрь (борджгали) ---------- */
export function Ornament({ size = 48, strokeWidth = 5, className, style }: { size?: number; strokeWidth?: number; className?: string; style?: CSSProperties }) {
  const arms = [];
  for (let i = 0; i < 7; i++) {
    arms.push(<path key={i} d="M50 50 C 50 30, 66 18, 82 26 C 70 24, 60 34, 62 46" transform={`rotate(${(i * 360) / 7} 50 50)`} />);
  }
  return (
    <svg className={cx("ag-ornament", className)} style={style} width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden>
      {arms}
      <circle cx={50} cy={50} r={6} fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---------- Logo ---------- */
export function Logo({ size = "md", tone = "ink", tagline, className }: { size?: "md" | "lg"; tone?: "ink" | "light"; tagline?: string | false; className?: string }) {
  return (
    <span className={cx("ag-logo", "ag-logo-" + tone, size === "lg" && "ag-logo-lg", className)}>
      <Ornament size={size === "lg" ? 44 : 30} className="ag-logo-mark" />
      <span className="ag-logo-text">
        <span className="ag-logo-name">Арго</span>
        {tagline === false ? null : <span className="ag-logo-tag">{tagline || "грузинский ресторан · Бугульма"}</span>}
      </span>
    </span>
  );
}

/* ---------- Button ---------- */
type ButtonBase = {
  variant?: "primary" | "secondary" | "outline" | "light" | "onphoto";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconLeft?: IconName;
  block?: boolean;
  className?: string;
  children?: ReactNode;
};
type ButtonAsButton = ButtonBase & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = ButtonBase & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", icon, iconLeft, block, className, children, ...rest } = props;
  const cls = cx("ag-btn", "ag-btn-" + variant, "ag-btn-" + size, icon && "ag-btn-has-icon", block && "ag-btn-block", className);
  const inner = (
    <>
      {iconLeft ? <Icon name={iconLeft} size={18} /> : null}
      <span>{children}</span>
      {icon ? (
        <span className="ag-btn-disc">
          <Icon name={icon} size={18} />
        </span>
      ) : null}
    </>
  );
  if ("href" in rest && rest.href) {
    const { href, ...a } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    const external = /^(https?:|tel:|mailto:)/.test(href);
    if (external) return <a href={href} className={cls} {...a}>{inner}</a>;
    return <Link href={href} className={cls} {...a}>{inner}</Link>;
  }
  const b = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...b} className={cls}>
      {inner}
    </button>
  );
}

/* ---------- IconButton ---------- */
export function IconButton({ icon = "plus", variant = "olive", size = "md", label, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: IconName; label: string; variant?: "olive" | "terracotta" | "outline" | "light"; size?: "sm" | "md" | "lg" }) {
  return (
    <button type="button" {...rest} aria-label={label} title={label} className={cx("ag-ibtn", "ag-ibtn-" + variant, "ag-ibtn-" + size, className)}>
      <Icon name={icon} size={size === "sm" ? 16 : 20} />
    </button>
  );
}

/* ---------- Badge ---------- */
const BADGE: Record<string, [string | null, IconName | null]> = {
  hit: ["Хит", "star"],
  spicy: ["Острое", "fire"],
  veg: ["Вегетарианское", "leaf"],
  new: ["Новинка", null],
  chef: ["Шеф рекомендует", "star"],
  sale: ["Акция", null],
  neutral: [null, null],
};
export function Badge({ tone = "neutral", onPhoto, children, className }: { tone?: BadgeTone | "neutral"; onPhoto?: boolean; children?: ReactNode; className?: string }) {
  const def = BADGE[tone] || BADGE.neutral;
  return (
    <span className={cx("ag-badge", "ag-badge-" + tone, onPhoto && "ag-badge-onphoto", className)}>
      {def[1] ? <Icon name={def[1]} size={13} strokeWidth={2.2} /> : null}
      {children || def[0]}
    </span>
  );
}

/* ---------- FilterChip ---------- */
export function FilterChip({ selected, count, icon, onClick, children, className }: { selected?: boolean; count?: number; icon?: IconName; onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button type="button" aria-pressed={!!selected} onClick={onClick} className={cx("ag-chip", selected && "is-selected", className)}>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span>{children}</span>
      {count != null ? <span className="ag-chip-count">{count}</span> : null}
    </button>
  );
}

/* ---------- PhotoSlot ---------- */
export function PhotoSlot({ src, alt, ratio = "4 / 3", radius, tone = "terracotta", label, children, className, style }: { src?: string; alt?: string; ratio?: string; radius?: "md" | "lg" | "xl"; tone?: Tone; label?: string | null; children?: ReactNode; className?: string; style?: CSSProperties }) {
  const fill = ratio === "fill";
  const s: CSSProperties = {
    aspectRatio: fill ? "auto" : ratio,
    height: fill ? "100%" : undefined,
    borderRadius: radius ? `var(--radius-${radius})` : fill ? 0 : undefined,
    ...style,
  };
  if (src)
    return (
      <div className={cx("ag-photo", className)} style={s}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || ""} loading="lazy" />
        {children}
      </div>
    );
  return (
    <div className={cx("ag-photo", "ag-photo-empty", "ag-photo-" + tone, className)} style={s} role="img" aria-label={alt || label || "Фото"}>
      <Ornament size={64} className="ag-photo-orn" strokeWidth={4} />
      {label ? <span className="ag-photo-label">{label}</span> : null}
      {children}
    </div>
  );
}

/* ---------- CategoryTile ---------- */
export function CategoryTile({ title, count, countLabel = "блюд", tone = "terracotta", image, href = "#", className }: { title: string; count?: number; countLabel?: string; tone?: "terracotta" | "olive" | "cream" | "wine" | "saffron"; image?: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={cx("ag-cat", "ag-cat-" + tone, className)}>
      <span className="ag-cat-title">{title}</span>
      {count != null ? <span className="ag-cat-count">{count + " " + countLabel}</span> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <span className="ag-cat-art">{image ? <img src={image} alt="" /> : <Ornament size={88} strokeWidth={4} />}</span>
      <span className="ag-cat-go">
        <Icon name="arrow-right" size={18} />
      </span>
    </Link>
  );
}

/* ---------- EventCard ---------- */
export function EventCard({ kind = "event", day, month, meta, title, excerpt, image, photoLabel, href = "#", linkLabel = "Подробнее", className }: { kind?: "event" | "news" | "promo"; day?: string; month?: string; meta?: string; title: string; excerpt?: string; image?: string; photoLabel?: string; href?: string; linkLabel?: string; className?: string }) {
  return (
    <article className={cx("ag-event", "ag-event-" + kind, className)}>
      <div className="ag-event-media">
        <PhotoSlot src={image} label={image ? null : photoLabel} tone={kind === "news" ? "olive" : "wine"} ratio="16 / 10" radius="md" />
        {day ? (
          <div className="ag-event-date">
            <b>{day}</b>
            <span>{month}</span>
          </div>
        ) : null}
      </div>
      <div className="ag-event-body">
        <span className="ag-event-kind">
          {kind === "news" ? "Новость" : kind === "promo" ? "Акция" : "Событие"}
          {meta ? <span className="ag-event-meta">{" · " + meta}</span> : null}
        </span>
        <h3 className="ag-event-title">{title}</h3>
        {excerpt ? <p className="ag-event-excerpt">{excerpt}</p> : null}
        <Link className="ag-event-link" href={href}>
          {linkLabel}
          <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </article>
  );
}

/* ---------- PromoBanner ---------- */
export function PromoBanner({ overline, title, text, cta, href, discount, tone = "terracotta", className }: { overline?: string; title: string; text?: string; cta?: string; href?: string; discount?: string; tone?: Tone; className?: string }) {
  return (
    <section className={cx("ag-promo", "ag-promo-" + tone, className)}>
      <div className="ag-promo-text">
        {overline ? <span className="ag-promo-over">{overline}</span> : null}
        <h3 className="ag-promo-title">{title}</h3>
        {text ? <p className="ag-promo-copy">{text}</p> : null}
        {cta && href ? (
          <Button variant={tone === "night" ? "primary" : "light"} icon="arrow-right" href={href}>
            {cta}
          </Button>
        ) : null}
      </div>
      <div className="ag-promo-art">
        <Ornament size={180} className="ag-promo-orn" strokeWidth={3} />
        {discount ? <span className="ag-promo-disc">{discount}</span> : null}
      </div>
    </section>
  );
}
