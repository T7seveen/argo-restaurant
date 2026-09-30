import { NextResponse, type NextRequest } from "next/server";
import { clean, notifyAdmin, rateLimited } from "@/lib/notify";
import { site } from "@/lib/site";
import { formatPhone, validateBooking, type BookingInput } from "@/lib/validate";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }
  // honeypot: поле скрыто от людей, боты его заполняют
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "Слишком много заявок. Позвоните нам, пожалуйста." }, { status: 429 });

  const input: BookingInput = {
    name: clean(body.name, 60),
    phone: clean(body.phone, 30),
    date: clean(body.date, 10),
    time: clean(body.time, 5),
    guests: clean(body.guests, 3),
    consent: body.consent === true,
    comment: clean(body.comment, 500),
  };
  const errors = validateBooking(input, site.openHour, site.closeHour);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const [y, m, d] = input.date.split("-");
  const text = [
    "Бронь стола — сайт Арго",
    `Имя: ${input.name}`,
    `Телефон: ${formatPhone(input.phone)}`,
    `Дата: ${d}.${m}.${y}, ${input.time}`,
    `Гостей: ${input.guests}`,
    input.comment ? `Комментарий: ${input.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await notifyAdmin(text);
  } catch {
    return NextResponse.json({ ok: false, error: "Не получилось отправить заявку. Позвоните нам, пожалуйста." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
