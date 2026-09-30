import Link from "next/link";
import { Button, Logo } from "@/components/ds";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label="Арго — на главную" className="logo-link">
              <Logo tone="light" size="lg" />
            </Link>
            <p>Грузинская кухня по семейным рецептам. Хачапури из печи-тоне, хинкали ручной лепки, вина Грузии.</p>
          </div>
          <div>
            <div className="footer-h">Ресторан</div>
            <ul className="footer-links">
              <li><Link href="/menu">Меню</Link></li>
              <li><Link href="/about">О ресторане</Link></li>
              <li><Link href="/events">События и новости</Link></li>
              <li><Link href="/events?tab=promo">Акции</Link></li>
              <li><Link href="/about#halls">Банкеты</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-h">Контакты</div>
            <ul className="footer-links">
              <li>{site.address}</li>
              <li><a href={site.phoneHref}>{site.phone}</a></li>
              <li className="muted-night">{site.hours}</li>
            </ul>
          </div>
          <div>
            <div className="footer-h">Мы в соцсетях</div>
            <div className="footer-social">
              <a href={site.vk} target="_blank" rel="noopener noreferrer">ВКонтакте</a>
              <a href={site.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
            </div>
            <Button variant="primary" icon="arrow-right" size="sm" href="/menu" block className="footer-delivery">
              Заказать доставку
            </Button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© Ресторан «Арго», Бугульма</span>
          <Link href="/privacy">Политика конфиденциальности</Link>
        </div>
      </div>
    </footer>
  );
}
