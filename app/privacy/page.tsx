import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="page page-inner prose" id="main">
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Политика конфиденциальности" }]} />
        <h1 className="display-l">Политика обработки персональных данных</h1>
        <p className="muted">[Черновик. Перед запуском текст должен проверить юрист: укажите юридическое лицо, ИНН/ОГРН и адрес оператора.]</p>
        <h2 className="title">1. Кто обрабатывает данные</h2>
        <p>Оператор — ресторан «Арго» ([юридическое лицо, ИНН]), {site.address}. Контакт по вопросам данных: {site.phone}.</p>
        <h2 className="title">2. Какие данные мы получаем</h2>
        <p>Имя, номер телефона, адрес доставки и комментарий — только те, что вы сами указываете в форме брони стола или заказа.</p>
        <h2 className="title">3. Зачем</h2>
        <p>Чтобы подтвердить бронь или заказ, связаться с вами по телефону и доставить заказ. Рассылок без вашего отдельного согласия не делаем.</p>
        <h2 className="title">4. Как долго храним</h2>
        <p>Не дольше, чем нужно для выполнения брони или заказа, и не более [срок] после этого. Данные не передаём третьим лицам, кроме случаев, предусмотренных законом.</p>
        <h2 className="title">5. Ваши права</h2>
        <p>Вы можете отозвать согласие и попросить удалить ваши данные — позвоните нам по номеру {site.phone}.</p>
        <p className="small muted">Обработка ведётся в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».</p>
      </main>
      <Footer />
    </>
  );
}
