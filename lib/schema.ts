import { categories } from "./menu";
import { site } from "./site";

export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Арго",
    description: "Грузинский ресторан в Бугульме: хачапури из печи-тоне, хинкали ручной лепки, мангал, вина Грузии.",
    url: site.url,
    telephone: site.phone,
    servesCuisine: ["Грузинская"],
    priceRange: "₽₽",
    acceptsReservations: true,
    hasMenu: `${site.url}/menu`,
    address: { "@type": "PostalAddress", addressLocality: "Бугульма", addressRegion: "Республика Татарстан", addressCountry: "RU", streetAddress: site.address },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lon },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: `${String(site.openHour).padStart(2, "0")}:00`,
        closes: `${String(site.closeHour).padStart(2, "0")}:00`,
      },
    ],
  };
}

export function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Меню ресторана Арго",
    url: `${site.url}/menu`,
    inLanguage: "ru",
    hasMenuSection: categories.map((c) => ({
      "@type": "MenuSection",
      name: c.title,
      hasMenuItem: c.dishes.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        description: d.description,
        url: `${site.url}/menu/${d.slug}`,
        offers: { "@type": "Offer", price: d.price, priceCurrency: "RUB" },
        ...(d.badges.includes("veg") ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
      })),
    })),
  };
}
