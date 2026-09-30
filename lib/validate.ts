/** Общая валидация форм — используется и в браузере, и в API. */

export function phoneDigits(v: string): string {
  let d = v.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d && !d.startsWith("7")) d = "7" + d;
  return d.slice(0, 11);
}

/** Маска «+7 (XXX) XXX-XX-XX» */
export function formatPhone(v: string): string {
  const d = phoneDigits(v);
  if (!d) return "";
  const p = d.slice(1);
  let out = "+7";
  if (p.length) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ")";
  if (p.length > 3) out += " " + p.slice(3, 6);
  if (p.length > 6) out += "-" + p.slice(6, 8);
  if (p.length > 8) out += "-" + p.slice(8, 10);
  return out;
}

export function isValidPhone(v: string): boolean {
  return phoneDigits(v).length === 11;
}

export function isValidName(v: string): boolean {
  const t = v.trim();
  return t.length >= 2 && t.length <= 60;
}

/** YYYY-MM-DD в часовом поясе ресторана (Бугульма, UTC+3) */
export function todayISO(offsetDays = 0): string {
  const now = new Date(Date.now() + 3 * 3600 * 1000 + offsetDays * 86400 * 1000);
  return now.toISOString().slice(0, 10);
}

export function nowMinutesMSK(): number {
  const now = new Date(Date.now() + 3 * 3600 * 1000);
  return now.getUTCHours() * 60 + now.getUTCMinutes();
}

export type BookingInput = { name: string; phone: string; date: string; time: string; guests: string; consent: boolean; comment?: string };

export function validateBooking(b: BookingInput, openHour: number, closeHour: number): Partial<Record<keyof BookingInput, string>> {
  const e: Partial<Record<keyof BookingInput, string>> = {};
  if (!isValidName(b.name || "")) e.name = "Как к вам обращаться?";
  if (!isValidPhone(b.phone || "")) e.phone = "Проверьте номер: +7 и 10 цифр";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || "")) e.date = "Выберите дату";
  else if (b.date < todayISO()) e.date = "Дата уже прошла";
  else if (b.date > todayISO(90)) e.date = "Бронируем не дальше чем на 90 дней";
  const m = /^(\d{2}):(\d{2})$/.exec(b.time || "");
  if (!m) e.time = "Выберите время";
  else {
    const mins = +m[1] * 60 + +m[2];
    if (mins < openHour * 60 || mins > (closeHour - 1) * 60) e.time = `Бронируем с ${pad(openHour)}:00 до ${pad(closeHour - 1)}:00`;
    else if (!e.date && b.date === todayISO() && mins < nowMinutesMSK() + 30) e.time = "Это время уже прошло — выберите позже";
  }
  if (!["1", "2", "3", "4", "5", "6+"].includes(b.guests)) e.guests = "Сколько вас будет?";
  if (!b.consent) e.consent = "Нужно согласие на обработку данных";
  return e;
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function timeSlots(openHour: number, closeHour: number): string[] {
  const out: string[] = [];
  for (let h = openHour; h < closeHour; h++) {
    out.push(`${pad(h)}:00`, `${pad(h)}:30`);
  }
  return out.filter((t) => t <= `${pad(closeHour - 1)}:00`);
}
