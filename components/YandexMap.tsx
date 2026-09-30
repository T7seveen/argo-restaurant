import { site } from "@/lib/site";

/** Яндекс.Карты (виджет-iframe, грузится лениво при прокрутке). */
export function YandexMap({ className }: { className?: string }) {
  const { lat, lon } = site.geo;
  const src = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=15&pt=${lon}%2C${lat}%2Cpm2rdm`;
  return (
    <div className={"map " + (className || "")}>
      <iframe src={src} title="Арго на Яндекс.Картах" loading="lazy" allowFullScreen />
    </div>
  );
}
