import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ds";
import { DishDetails } from "@/components/DishDetails";
import { Footer } from "@/components/Footer";
import { Header, MobileOrderBar } from "@/components/Header";
import { Breadcrumbs, JsonLd } from "@/components/Section";
import { allDishes, getDish } from "@/lib/menu";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return allDishes.map((d) => ({ slug: d.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const dish = getDish(slug);
  if (!dish) return {};
  const description = `${dish.description || ""} ${dish.weight ? dish.weight + ", " : ""}${dish.price} ₽. Грузинский ресторан Арго, Бугульма.`.trim();
  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.slug}` },
    openGraph: { title: `${dish.name} — Арго`, description },
  };
}

export default async function DishPage({ params }: PageProps<"/menu/[slug]">) {
  const { slug } = await params;
  const dish = getDish(slug);
  if (!dish) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MenuItem",
          name: dish.name,
          description: dish.details || dish.description,
          url: `${site.url}/menu/${dish.slug}`,
          offers: { "@type": "Offer", price: dish.price, priceCurrency: "RUB" },
        }}
      />
      <Header order />
      <main className="page page-inner" id="main">
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/menu", label: "Меню" }, { href: `/menu?cat=${dish.categoryId}`, label: dish.categoryTitle }, { label: dish.name }]} />
        <div className="dish-page">
          <DishDetails dish={dish} asPage />
        </div>
        <div className="center">
          <Button variant="outline" iconLeft="arrow-left" href={`/menu?cat=${dish.categoryId}`}>
            Всё из раздела «{dish.categoryTitle}»
          </Button>
        </div>
      </main>
      <Footer />
      <MobileOrderBar />
    </>
  );
}
