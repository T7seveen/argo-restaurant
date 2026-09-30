import "server-only";

/**
 * Доставка заявок администратору.
 * Telegram: переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.
 * Если они не заданы, заявка пишется в лог сервера (видно в Vercel → Logs).
 */
export async function notifyAdmin(text: string): Promise<{ delivered: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log("[argo] заявка (Telegram не настроен):\n" + text);
    return { delivered: false };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });
  if (!res.ok) {
    console.error("[argo] Telegram ответил", res.status, await res.text());
    throw new Error("telegram");
  }
  return { delivered: true };
}

/** Простая защита от спама: не больше N заявок с одного IP за окно. */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > limit;
}

export function clean(v: unknown, max = 300): string {
  return String(v ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}
