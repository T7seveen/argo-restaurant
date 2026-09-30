import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header, MobileOrderBar } from "@/components/Header";
import { MenuBrowser, MenuStatic } from "@/components/MenuBrowser";
import { Breadcrumbs, JsonLd } from "@/components/Section";
import { menuSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Меню",
  description: "Хачапури из печи-тоне, хинкали ручной лепки, мангал, закуски, супы, десерты и вина Грузии. Цены, вес, состав — закажите доставку или к вашему приходу.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  const head = (
    <div>
      <h1 className="display-xl">Меню ресторана</h1>
      <p className="lead menu-lead">Всё, что готовим на кухне Арго. Выберите блюда — закажем доставку или приготовим к вашему приходу.</p>
    </div>
  );
  return (
    <>
      <JsonLd data={menuSchema()} />
      <Header order />
      <main className="page page-inner" id="main">
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Меню" }]} />
        <Suspense fallback={<MenuStatic head={head} />}>
          <MenuBrowser head={head} />
        </Suspense>
      </main>
      <Footer />
      <MobileOrderBar />
    </>
  );
}
