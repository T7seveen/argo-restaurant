import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { Button, CategoryTile, EventCard, Icon, Ornament, PhotoSlot, PromoBanner } from "@/components/ds";
import { Footer } from "@/components/Footer";
import { Header, MobileOrderBar } from "@/components/Header";
import { HitsCarousel } from "@/components/HitsCarousel";
import { JsonLd, SectionTitle } from "@/components/Section";
import { YandexMap } from "@/components/YandexMap";
import { events } from "@/lib/events";
import { allDishes, dishCountLabel, getCategory, hits } from "@/lib/menu";
import { restaurantSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const tiles = [
  { id: "khachapuri", tone: "terracotta" },
  { id: "khinkali", tone: "olive" },
  { id: "mangal", tone: "cream" },
  { id: "wine", tone: "wine" },
  { id: "desserts", tone: "saffron" },
] as const;

const values = [
  { icon: "fire", text: "Печь-тоне для хачапури и лаваша" },
  { icon: "heart", text: "Хинкали ручной лепки" },
  { icon: "leaf", text: "Сыры и специи из Грузии" },
  { icon: "wine", text: "Вина Кахетии и Имерети" },
] as const;

export default function Home() {
  const moreHits = allDishes.filter((d) => (d.badges.includes("hit") || d.badges.includes("chef")) && !hits.includes(d));
  const carousel = [...hits, ...moreHits];
  return (
    <>
      <JsonLd data={restaurantSchema()} />
      <section className="hero">
        <Header variant="dark" />
        <div className="hero-grid" id="main">
          <div className="hero-text">
            <div className="overline overline-saffron">Грузинский ресторан в Бугульме</div>
            <h1 className="display-xl">
              Грузия <br className="br-desk" />
              за нашим столом
            </h1>
            <p className="hero-lead">
              Много лет готовим так, как готовят в Тбилиси и Батуми: хачапури из печи-тоне, хинкали ручной лепки, мясо на углях и вина Грузии.
            </p>
            <div className="hero-actions">
              <Button variant="primary" size="lg" icon="arrow-right" href="#booking">
                Забронировать стол
              </Button>
              <Link href="/menu" className="btn-ghost-dark">
                Смотреть меню <Icon name="arrow-right" size={18} />
              </Link>
            </div>
            <ul className="hero-facts">
              <li><Icon name="fire" size={18} /> Печь-тоне</li>
              <li><Icon name="heart" size={18} /> Лепим вручную</li>
              <li><Icon name="wine" size={18} /> Вина Грузии</li>
              <li><Icon name="clock" size={18} /> {site.hours}</li>
            </ul>
          </div>
          <div className="hero-art">
            <div className="hero-arch">
              <PhotoSlot label="Фото: хачапури выходит из печи-тоне" tone="terracotta" ratio="fill" />
            </div>
            <div className="hero-card">
              <div className="hero-card-img">
                <PhotoSlot tone="olive" ratio="1 / 1" />
              </div>
              <div>
                <div className="title-s">Хинкали</div>
                <div className="small muted">лепим каждое утро, 19 складок</div>
              </div>
            </div>
            <div className="hero-seal" aria-label={`с ${site.since} в Бугульме`}>
              <span>с {site.since}</span>
              <b>в Бугульме</b>
            </div>
          </div>
        </div>
      </section>

      <main className="page">
        <section className="section" aria-labelledby="cats-title">
          <div className="section-head">
            <SectionTitle overline="Меню" title="Что у нас готовят" id="cats-title" />
            <Button variant="outline" icon="arrow-right" href="/menu" className="hide-mobile">
              Всё меню
            </Button>
          </div>
          <div className="cat-grid">
            {tiles.map((t) => {
              const c = getCategory(t.id)!;
              return <CategoryTile key={t.id} title={c.title} count={c.dishes.length} countLabel={dishCountLabel(c.id, c.dishes.length)} tone={t.tone} href={`/menu?cat=${c.id}`} />;
            })}
          </div>
        </section>

        <section className="section about-teaser" aria-labelledby="about-title">
          <div className="about-teaser-text">
            <SectionTitle overline="О ресторане" title="Традиции, которые мы не упрощаем" id="about-title" />
            <p className="lead">
              Тесто для хачапури ставим на мацони с вечера, хинкали лепим руками каждое утро, мясо жарим только на углях. Специи, сыры и вина — грузинские. Так мы готовим с первого дня и не собираемся менять.
            </p>
            <ul className="values">
              {values.map((v) => (
                <li key={v.text}>
                  <span className="value-icon">
                    <Icon name={v.icon} size={24} />
                  </span>
                  {v.text}
                </li>
              ))}
            </ul>
            <Button variant="secondary" icon="arrow-right" href="/about">
              О ресторане
            </Button>
          </div>
          <div className="collage">
            <PhotoSlot label="Фото: зал ресторана" tone="olive" ratio="fill" className="collage-a" />
            <PhotoSlot label="Фото: повар лепит хинкали" tone="wine" ratio="fill" className="collage-b" />
            <Ornament size={96} className="collage-orn" />
          </div>
        </section>

        <HitsCarousel dishes={carousel} header={<SectionTitle overline="Хиты" title="Попробуйте в первый раз" id="hits-title" />} />

        <PromoBanner tone="night" overline="Счастливые часы, пн–чт" title="−20% на всю кухню с 15:00 до 17:00" text="Скидка на всё меню кухни в зале. Не действует на напитки и доставку." cta="Все акции" href="/events?tab=promo" discount="−20%" />

        <section className="section" aria-labelledby="events-title">
          <div className="section-head">
            <SectionTitle overline="Афиша" title="События и новости" id="events-title" />
            <Button variant="outline" icon="arrow-right" href="/events" className="hide-mobile">
              Все события
            </Button>
          </div>
          <div className="grid-3 scroll-mobile">
            {events.slice(0, 3).map((e) => (
              <EventCard key={e.slug} kind={e.kind} day={e.day} month={e.month} meta={e.meta} title={e.title} excerpt={e.excerpt} photoLabel={e.photoLabel} linkLabel={e.linkLabel} href={`/events/${e.slug}`} />
            ))}
          </div>
          <Button variant="outline" icon="arrow-right" href="/events" className="show-mobile" block>
            Все события
          </Button>
        </section>

        <section className="section booking" id="booking" aria-labelledby="booking-title">
          <div className="booking-card">
            <SectionTitle overline="Бронь стола" title="Ждём вас в гости" id="booking-title" />
            <p className="muted">Оставьте телефон — администратор перезвонит в течение 15 минут и подтвердит бронь.</p>
            <BookingForm />
          </div>
          <div className="find-card">
            <div className="overline">Как нас найти</div>
            <YandexMap />
            <dl className="find-facts">
              <div><dt>Адрес</dt><dd>{site.address}</dd></div>
              <div><dt>Телефон</dt><dd><a href={site.phoneHref}>{site.phone}</a></dd></div>
              <div><dt>Часы работы</dt><dd>{site.hours}</dd></div>
              <div><dt>Банкеты</dt><dd>{site.banquet}</dd></div>
            </dl>
          </div>
        </section>
      </main>
      <Footer />
      <MobileOrderBar />
    </>
  );
}
