import type { ReactNode } from "react";

export function SectionTitle({ overline, title, id, as = "h2" }: { overline?: string; title: ReactNode; id?: string; as?: "h1" | "h2" }) {
  const H = as;
  return (
    <div className="section-title">
      {overline ? <div className="overline">{overline}</div> : null}
      <H id={id} className={as === "h1" ? "display-xl" : "display-l"}>
        {title}
      </H>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="crumbs">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 ? " / " : null}
          {it.href ? <a href={it.href}>{it.label}</a> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
