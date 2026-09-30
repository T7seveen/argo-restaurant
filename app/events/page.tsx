import type { Metadata } from "next";
import { Suspense } from "react";
import { Badge, Button, Ornament, PhotoSlot, PromoBanner } from "@/components/ds";
import { EventsStatic, EventsTabs } from "@/components/EventsBrowser";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Breadcrumbs, SectionTitle } from "@/components/Section";
import { featured } from "@/lib/events";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "События, новости и акции",
  description: "Афиша ресторана Арго в Бугульме: грузинские вечера, мастер-классы, новые блюда и акции.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  const title = <h1 className="display-xl events-title">События, новости и акции</h1>;
  const feat = (
    <article className="featured">
      <PhotoSlot label={featured.photoLabel} tone="wine" ratio="fill" className="featured-photo" />
      <div className="featured-text">
        <div className="featured-meta">
          <Badge tone="chef">Главное событие</Badge>
          <span>{featured.meta}</span>
        </div>
        <h2 className="display-l">{featured.title}</h2>
        <p>{featured.text}</p>
        <div className="featured-cta">
          <Button variant="primary" icon="arrow-right" href="/#booking">
            Забронировать место
          </Button>
          <b className="featured-price">{featured.price}</b>
        </div>
      </div>
    </article>
  );
  return (
    <>
      <Header />
      <main className="page page-inner" id="main">
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "События и акции" }]} />
        <Suspense fallback={<EventsStatic title={title} featured={feat} />}>
          <EventsTabs title={title} featured={feat} />
        </Suspense>

        <section className="section" aria-labelledby="always-title">
          <SectionTitle overline="Постоянные акции" title="Действуют всегда" id="always-title" />
          <div className="grid-2">
            <PromoBanner tone="terracotta" overline="пн–чт, 15:00–17:00" title="Счастливые часы −20%" text="На всё меню кухни в зале." cta="Забронировать" href="/#booking" discount="−20%" />
            <PromoBanner tone="olive" overline="Самовывоз" title="−10% на заказ с собой" text="Закажите на сайте или по телефону и заберите сами." cta="Заказать" href="/menu" discount="−10%" />
          </div>
        </section>

        <section className="subscribe" aria-labelledby="sub-title">
          <Ornament size={56} className="accent-orn" />
          <div className="subscribe-text">
            <h2 id="sub-title" className="title">
              Узнавайте об афише первыми
            </h2>
            <p className="muted">Анонсы вечеров, новые блюда и акции — в нашем Telegram-канале.</p>
          </div>
          <Button variant="secondary" icon="arrow-right" href={site.telegram} target="_blank" rel="noopener noreferrer">
            Подписаться в Telegram
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
