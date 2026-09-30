import type { Metadata } from "next";
import { Badge, Button, Icon, PhotoSlot } from "@/components/ds";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Breadcrumbs, JsonLd, SectionTitle } from "@/components/Section";
import { YandexMap } from "@/components/YandexMap";
import { restaurantSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "О ресторане",
  description: "Арго — грузинское застолье в Бугульме: печь-тоне, хинкали ручной лепки, вина Грузии. Залы для ужина вдвоём и банкетов.",
  alternates: { canonical: "/about" },
};

const traditions = [
  { n: "01", title: "Печь-тоне", text: "Хачапури и шоти пекутся на стенках глиняной печи при высокой температуре — так получается хрустящий край и мягкая середина.", tone: "terracotta", photo: "Фото: печь-тоне" },
  { n: "02", title: "Хинкали ручной лепки", text: "Каждое утро повара лепят хинкали вручную — с сочным бульоном внутри и тонким тестом.", tone: "olive", photo: "Фото: хинкали ручной лепки" },
  { n: "03", title: "Вина Грузии", text: "Саперави, Киндзмараули, Мукузани и вина квеври из Кахетии — подскажем, что подойдёт к вашим блюдам.", tone: "wine", photo: "Фото: вина Грузии" },
] as const;

const halls = [
  { title: "Основной зал", meta: "[N] мест", text: "Открытая кухня и печь-тоне на виду — видно, как пекут хачапури.", tone: "terracotta", photo: "Фото: основной зал" },
  { title: "Банкетный зал", meta: "до [N] гостей", text: "Для свадеб, юбилеев и корпоративов. Составим банкетное меню и подберём вино.", tone: "wine", photo: "Фото: банкетный зал" },
  { title: "Летняя веранда", meta: "[N] мест, май–сентябрь", text: "Мангал рядом, вечером — живая музыка по пятницам.", tone: "olive", photo: "Фото: летняя веранда" },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={restaurantSchema()} />
      <Header />
      <main className="page page-inner" id="main">
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "О ресторане" }]} />
        <section className="about-hero">
          <div className="about-hero-text">
            <div className="overline">О ресторане</div>
            <h1 className="display-xl">Арго — это грузинское застолье в Бугульме</h1>
            <p className="lead">
              Мы открылись в {site.since.replace("года", "году")} с простой идеей: готовить грузинскую еду так, как её готовят дома в Грузии, — без упрощений и замен. С тех пор к нам приходят семьями, отмечают праздники и возвращаются за теми самыми хинкали.
            </p>
            <div className="hero-actions">
              <Button variant="primary" icon="arrow-right" href="/#booking">
                Забронировать стол
              </Button>
              <Button variant="outline" href="/menu">
                Смотреть меню
              </Button>
            </div>
          </div>
          <div className="about-arch">
            <PhotoSlot label="Фото: фасад или главный зал" tone="terracotta" ratio="fill" />
          </div>
        </section>

        <section className="section" aria-labelledby="trad-title">
          <SectionTitle overline="Традиции" title="Что мы делаем по-грузински" id="trad-title" />
          <div className="grid-3">
            {traditions.map((t) => (
              <article key={t.n} className="trad-card">
                <PhotoSlot label={t.photo} tone={t.tone} ratio="4 / 3" radius="md" />
                <div className="trad-body">
                  <span className="trad-n">{t.n}</span>
                  <h3 className="title">{t.title}</h3>
                  <p className="muted">{t.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="chef" aria-labelledby="chef-title">
          <PhotoSlot label="Фото: шеф-повар" tone="olive" ratio="1 / 1" radius="lg" className="chef-photo" />
          <div className="chef-text">
            <div className="overline">Кухня</div>
            <h2 id="chef-title" className="display-l">
              [Имя шеф-повара]
            </h2>
            <p className="lead muted">[Пара предложений о шефе: откуда он, где учился готовить грузинскую кухню, какое блюдо считает главным. Лучше — его собственными словами.]</p>
            <p className="chef-note">
              <Badge tone="chef" /> <span className="small muted">Блюда шефа отмечены в меню этой меткой</span>
            </p>
          </div>
        </section>

        <section className="section" id="halls" aria-labelledby="halls-title">
          <div className="section-head">
            <SectionTitle overline="Залы" title="Для ужина вдвоём и большой супры" id="halls-title" />
            <Button variant="secondary" icon="arrow-right" href="/#booking">
              Заказать банкет
            </Button>
          </div>
          <div className="grid-3">
            {halls.map((h) => (
              <article key={h.title} className="hall">
                <PhotoSlot label={h.photo} tone={h.tone} ratio="16 / 10" radius="lg" />
                <div className="hall-head">
                  <h3 className="title">{h.title}</h3>
                  <span className="hall-meta">{h.meta}</span>
                </div>
                <p className="muted small">{h.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contacts" id="contacts" aria-labelledby="contacts-title">
          <div className="contacts-card">
            <div className="overline overline-on">Контакты</div>
            <h2 id="contacts-title" className="display-l">
              Приходите в гости
            </h2>
            <ul className="contacts-list">
              <li><Icon name="pin" size={20} /> {site.address}</li>
              <li><Icon name="phone" size={20} /> <a href={site.phoneHref}>{site.phone}</a></li>
              <li><Icon name="clock" size={20} /> {site.hours}</li>
            </ul>
            <Button variant="light" icon="arrow-right" href="/#booking">
              Забронировать стол
            </Button>
          </div>
          <YandexMap className="contacts-map" />
        </section>
      </main>
      <Footer />
    </>
  );
}
