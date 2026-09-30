import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { DishModal } from "@/components/DishModal";
import { MobileNav } from "@/components/Header";
import { UIProvider } from "@/components/ui-state";
import { site } from "@/lib/site";
import "./styles/tokens.css";
import "./styles/ds.css";
import "./globals.css";

const prata = localFont({ src: "./fonts/Prata-Regular.woff2", weight: "400", display: "swap", variable: "--font-prata" });
const manrope = localFont({ src: "./fonts/Manrope-Variable.woff2", weight: "200 800", display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Арго — грузинский ресторан в Бугульме", template: "%s — Арго, Бугульма" },
  description: "Хачапури из печи-тоне, хинкали ручной лепки, мясо на мангале и вина Грузии. Бронь стола, доставка и самовывоз.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Арго",
    title: "Арго — грузинский ресторан в Бугульме",
    description: "Хачапури из печи-тоне, хинкали ручной лепки, мясо на мангале и вина Грузии.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1f1611",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${prata.variable} ${manrope.variable}`}>
      <body>
        <UIProvider>
          <a href="#main" className="skip-link">
            К содержимому
          </a>
          {children}
          <MobileNav />
          <CartDrawer />
          <Suspense fallback={null}>
            <DishModal />
          </Suspense>
        </UIProvider>
      </body>
    </html>
  );
}
