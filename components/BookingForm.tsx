"use client";

import { useState, type FormEvent } from "react";
import { Button, FilterChip, Icon, Ornament } from "@/components/ds";
import { site } from "@/lib/site";
import { formatPhone, timeSlots, todayISO, validateBooking, type BookingInput } from "@/lib/validate";
import { Consent, Field, Honeypot, postJSON } from "./forms";

const GUESTS = ["1", "2", "3", "4", "5", "6+"];

export function BookingForm() {
  const [v, setV] = useState<BookingInput>({ name: "", phone: "", date: "", time: "19:00", guests: "2", consent: false });
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const slots = timeSlots(site.openHour, site.closeHour);

  function set<K extends keyof BookingInput>(k: K, val: BookingInput[K]) {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validateBooking(v, site.openHour, site.closeHour);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById("bk-" + first)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    const res = await postJSON("/api/booking", { ...v, website: hp });
    if (res.ok) setStatus("done");
    else {
      setStatus("error");
      if (res.errors) setErrors(res.errors);
      setServerError(res.error || "Проверьте поля формы");
    }
  }

  if (status === "done") {
    const [y, m, d] = v.date.split("-");
    return (
      <div className="booking-done" role="status">
        <Ornament size={64} className="booking-done-orn" />
        <h3 className="title">Заявка принята</h3>
        <p className="muted">
          {v.name.trim()}, ждём вас {d}.{m}.{y} в {v.time}, гостей: {v.guests}. Администратор перезвонит на {formatPhone(v.phone)} и подтвердит бронь.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setStatus("idle");
            setV({ name: "", phone: "", date: "", time: "19:00", guests: "2", consent: false });
          }}
        >
          Забронировать ещё
        </Button>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field id="bk-name" label="Имя" error={errors.name}>
          <input id="bk-name" autoComplete="name" placeholder="Как к вам обращаться" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "bk-name-err" : undefined} />
        </Field>
        <Field id="bk-phone" label="Телефон" error={errors.phone}>
          <input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7" value={v.phone} onChange={(e) => set("phone", formatPhone(e.target.value))} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "bk-phone-err" : undefined} />
        </Field>
        <Field id="bk-date" label="Дата" error={errors.date}>
          <input id="bk-date" type="date" min={todayISO()} max={todayISO(90)} value={v.date} onChange={(e) => set("date", e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? "bk-date-err" : undefined} />
        </Field>
        <Field id="bk-time" label="Время" error={errors.time}>
          <select id="bk-time" value={v.time} onChange={(e) => set("time", e.target.value)} aria-invalid={!!errors.time} aria-describedby={errors.time ? "bk-time-err" : undefined}>
            {slots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <fieldset className="field guests">
        <legend>Гостей</legend>
        <div className="guests-chips" role="group">
          {GUESTS.map((g) => (
            <FilterChip key={g} selected={v.guests === g} onClick={() => set("guests", g)} className="guest-chip">
              {g}
            </FilterChip>
          ))}
        </div>
        {v.guests === "6+" ? <p className="small muted">Для компании больше шести гостей администратор предложит банкетный зал.</p> : null}
      </fieldset>
      <Consent id="bk-consent" checked={v.consent} onChange={(c) => set("consent", c)} error={errors.consent} />
      <Honeypot value={hp} onChange={setHp} />
      {serverError ? (
        <p className="form-error" role="alert">
          <Icon name="phone" size={16} /> {serverError}
        </p>
      ) : null}
      <Button type="submit" variant="primary" size="lg" icon="arrow-right" block disabled={status === "sending"}>
        {status === "sending" ? "Отправляем…" : "Забронировать стол"}
      </Button>
    </form>
  );
}
