import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, EventCard, PhotoSlot } from "@/components/ds";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Breadcrumbs, SectionTitle } from "@/components/Section";
import { events, getEvent, kindLabel } from "@/lib/events";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = getEvent(slug);
  if (!e) return {};
  return { title: e.title, description: e.excerpt, alternates: { canonical: `/events/${e.slug}` }, openGraph: { title: e.title, description: e.excerpt } };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const e = getEvent(slug);
  if (!e) notFound();
  const more = events.filter((x) => x.slug !== e.slug).slice(0, 3);
  return (
    <>
      <Header />
      <main className="page page-inner" id="main">
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/events", label: "События и акции" }, { label: e.title }]} />
        <article className="event-article">
          <div className="event-article-text">
            <div className={`ag-event-kind event-kind-${e.kind}`}>
              {kindLabel[e.kind]}
              {e.meta ? <span className="ag-event-meta"> · {e.meta}</span> : null}
              {e.day ? <span className="ag-event-meta"> · {e.day} {e.month}</span> : null}
            </div>
            <h1 className="display-xl">{e.title}</h1>
            <p className="lead">{e.excerpt}</p>
            {(e.body || ["[Подробное описание: программа, условия, цена, как записаться.]"]).map((p, i) => (
              <p key={i} className="muted">
                {p}
              </p>
            ))}
            <div className="hero-actions">
              {e.kind === "news" ? (
                <Button variant="primary" icon="arrow-right" href="/menu">
                  Смотреть меню
                </Button>
              ) : (
                <Button variant="primary" icon="arrow-right" href="/#booking">
                  {e.kind === "event" ? "Забронировать место" : "Забронировать стол"}
                </Button>
              )}
              <Button variant="outline" iconLeft="arrow-left" href="/events">
                Вся афиша
              </Button>
            </div>
          </div>
          <PhotoSlot label={e.photoLabel} tone={e.kind === "news" ? "olive" : "wine"} ratio="16 / 10" radius="xl" />
        </article>
        <section className="section" aria-labelledby="more-title">
          <SectionTitle overline="Афиша" title="Ещё в Арго" id="more-title" />
          <div className="grid-3 scroll-mobile">
            {more.map((x) => (
              <EventCard key={x.slug} kind={x.kind} day={x.day} month={x.month} meta={x.meta} title={x.title} excerpt={x.excerpt} photoLabel={x.photoLabel} linkLabel={x.linkLabel} href={`/events/${x.slug}`} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
