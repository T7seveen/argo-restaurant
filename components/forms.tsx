"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function Field({ id, label, error, children, className }: { id: string; label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={"field " + (error ? "has-error " : "") + (className || "")}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <span className="field-error" id={id + "-err"} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function Consent({ id, checked, onChange, error }: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div className={"consent " + (error ? "has-error" : "")}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error} aria-describedby={error ? id + "-err" : undefined} />
      <label htmlFor={id}>
        Даю согласие на обработку персональных данных по{" "}
        <Link href="/privacy" target="_blank">
          политике конфиденциальности
        </Link>
      </label>
      {error ? (
        <span className="field-error" id={id + "-err"} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/** Скрытое поле-ловушка для ботов */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="hp" aria-hidden="true">
      <label>
        Сайт
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="website" />
      </label>
    </div>
  );
}

export async function postJSON(url: string, data: unknown): Promise<{ ok: boolean; errors?: Record<string, string>; error?: string }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    return await res.json();
  } catch {
    return { ok: false, error: "Нет связи с сервером. Проверьте интернет или позвоните нам." };
  }
}
