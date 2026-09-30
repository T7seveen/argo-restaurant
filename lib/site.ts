/**
 * Контакты и реквизиты ресторана.
 * Всё в [квадратных скобках] — заглушки из макета: заменить реальными данными до запуска.
 */
export const site = {
  name: "Арго",
  tagline: "грузинский ресторан · Бугульма",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://argo-bugulma.vercel.app",
  phone: "+7 (85594) [телефон]",
  phoneHref: "tel:+785594",
  address: "г. Бугульма, [улица, дом]",
  hours: "Ежедневно [12:00–23:00]",
  hoursShort: "[12:00–23:00]",
  /** Часы для бронирования и валидации времени */
  openHour: 12,
  closeHour: 23,
  since: "[года]",
  banquet: "до [N] гостей",
  /** Координаты центра Бугульмы — заменить на точку ресторана */
  geo: { lat: 54.5365, lon: 52.7896 },
  vk: "https://vk.com/",
  telegram: "https://t.me/",
};

export const nav = [
  { href: "/", label: "Главная" },
  { href: "/menu", label: "Меню" },
  { href: "/about", label: "О ресторане" },
  { href: "/events", label: "События" },
  { href: "/events?tab=promo", label: "Акции" },
  { href: "/about#contacts", label: "Контакты" },
];
