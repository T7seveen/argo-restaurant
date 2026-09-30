import raw from "@/data/menu.json";
import { slugify } from "./translit";

export type BadgeTone = "hit" | "spicy" | "veg" | "new" | "chef" | "sale";
export type Tone = "terracotta" | "olive" | "wine" | "night";

export interface Dish {
  slug: string;
  name: string;
  description?: string;
  /** Развёрнутое описание для карточки блюда */
  details?: string;
  price: number;
  oldPrice?: number;
  weight?: string;
  badges: BadgeTone[];
  image?: string;
  photoLabel: string;
  tone: Tone;
  composition?: string;
  allergens?: string;
  cookTime?: string;
  nutrition?: { kcal?: number; protein?: number; fat?: number; carbs?: number };
  categoryId: string;
  categoryTitle: string;
}

export interface Category {
  id: string;
  title: string;
  tone: Tone;
  dishes: Dish[];
}

type RawDish = {
  name: string;
  description?: string;
  details?: string;
  price: number;
  oldPrice?: number;
  weight?: string;
  badges?: string[];
  image?: string | null;
  composition?: string;
  allergens?: string;
  cookTime?: string;
  nutrition?: Dish["nutrition"];
};
type RawCategory = { id: string; title: string; tone?: string; dishes: RawDish[] };

export const categories: Category[] = (raw.categories as RawCategory[]).map((c) => ({
  id: c.id,
  title: c.title,
  tone: (c.tone as Tone) || "terracotta",
  dishes: c.dishes.map((d) => ({
    ...d,
    slug: slugify(d.name),
    badges: (d.badges || []) as BadgeTone[],
    image: d.image || undefined,
    photoLabel: "Фото: " + d.name.toLowerCase(),
    tone: (c.tone as Tone) || "terracotta",
    categoryId: c.id,
    categoryTitle: c.title,
  })),
}));

export const allDishes: Dish[] = categories.flatMap((c) => c.dishes);

const bySlug = new Map(allDishes.map((d) => [d.slug, d]));
export function getDish(slug: string): Dish | undefined {
  return bySlug.get(slug);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

/** «С этим берут»: закуска/салат и напиток, если блюдо само не из этих разделов. */
export function getPairings(dish: Dish): Dish[] {
  const pick = (catId: string, fallbackIndex = 0) => {
    const cat = getCategory(catId);
    if (!cat || cat.id === dish.categoryId) return undefined;
    return cat.dishes.find((d) => d.badges.includes("hit")) || cat.dishes[fallbackIndex];
  };
  const list = [pick("starters"), pick("wine") || pick("desserts"), pick("khachapuri")].filter(
    (d): d is Dish => !!d && d.slug !== dish.slug,
  );
  return list.slice(0, 2);
}

/** Хиты для главной */
export const hitSlugs = [
  "khachapuri-po-adzharski",
  "khinkali-s-govyadinoy-i-svininoy",
  "shashlyk-iz-svinoy-shei",
  "salat-po-gruzinski",
];
export const hits: Dish[] = hitSlugs.map((s) => getDish(s)).filter((d): d is Dish => !!d);

export function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}

/** 1 блюдо, 2 блюда, 5 блюд */
export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export function dishCountLabel(categoryId: string, n: number): string {
  return categoryId === "wine" ? plural(n, "позиция", "позиции", "позиций") : plural(n, "блюдо", "блюда", "блюд");
}
