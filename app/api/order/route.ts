import { NextResponse, type NextRequest } from "next/server";
import { getDish, formatPrice } from "@/lib/menu";
import { clean, notifyAdmin, rateLimited } from "@/lib/notify";
import { formatPhone, isValidName, isValidPhone } from "@/lib/validate";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "Слишком много заявок. Позвоните нам, пожалуйста." }, { status: 429 });

  const name = clean(body.name, 60);
  const phone = clean(body.phone, 30);
  const mode = body.mode === "delivery" ? "delivery" : "pickup";
  const address = clean(body.address, 200);
  const comment = clean(body.comment, 500);

  const errors: Record<string, string> = {};
  if (!isValidName(name)) errors.name = "Как к вам обращаться?";
  if (!isValidPhone(phone)) errors.phone = "Проверьте номер: +7 и 10 цифр";
  if (mode === "delivery" && address.length < 5) errors.address = "Укажите адрес доставки";
  if (body.consent !== true) errors.consent = "Нужно согласие на обработку данных";

  // Цены берём только с сервера — клиенту не доверяем
  const raw = Array.isArray(body.items) ? body.items : [];
  const lines = raw
    .map((it: { slug?: unknown; qty?: unknown }) => ({ dish: getDish(String(it?.slug)), qty: Math.floor(Number(it?.qty)) }))
    .filter((l) => l.dish && l.qty > 0 && l.qty <= 99);
  if (!lines.length) errors.items = "Заказ пуст";

  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const total = lines.reduce((s, l) => s + l.dish!.price * l.qty, 0);
  const text = [
    `Заказ — сайт Арго (${mode === "delivery" ? "доставка" : "самовывоз"})`,
    `Имя: ${name}`,
    `Телефон: ${formatPhone(phone)}`,
    mode === "delivery" ? `Адрес: ${address}` : "",
    comment ? `Комментарий: ${comment}` : "",
    "",
    ...lines.map((l) => `• ${l.dish!.name} × ${l.qty} = ${formatPrice(l.dish!.price * l.qty)}`),
    "",
    `Итого: ${formatPrice(total)}`,
  ]
    .filter((s, i, a) => s !== "" || (a[i - 1] ?? "") !== "")
    .join("\n");

  try {
    await notifyAdmin(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Не получилось отправить заказ. Позвоните нам, пожалуйста." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, total });
}
