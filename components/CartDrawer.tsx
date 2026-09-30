"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button, IconButton, Ornament } from "@/components/ds";
import { cart, useCart } from "@/lib/cart-store";
import { dishCountLabel, formatPrice, plural } from "@/lib/menu";
import { site } from "@/lib/site";
import { formatPhone, isValidName, isValidPhone } from "@/lib/validate";
import { Stepper } from "./DishCard";
import { Consent, Field, Honeypot, postJSON } from "./forms";
import { useOpenDish, useUI } from "./ui-state";
import { useDialog } from "./useDialog";

type Mode = "pickup" | "delivery";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setCartOpen(false);
  useDialog(cartOpen, close, ref);
  if (!cartOpen) return null;
  return (
    <div className="overlay overlay-side" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" ref={ref} tabIndex={-1}>
        <CartBody onClose={close} />
      </div>
    </div>
  );
}

function CartBody({ onClose }: { onClose: () => void }) {
  const { lines, count, total } = useCart();
  const openDish = useOpenDish();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [mode, setMode] = useState<Mode>("pickup");
  const [f, setF] = useState({ name: "", phone: "", address: "", comment: "", consent: false });
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [doneTotal, setDoneTotal] = useState(0);

  function set<K extends keyof typeof f>(k: K, val: (typeof f)[K]) {
    setF((p) => ({ ...p, [k]: val }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!isValidName(f.name)) errs.name = "Как к вам обращаться?";
    if (!isValidPhone(f.phone)) errs.phone = "Проверьте номер: +7 и 10 цифр";
    if (mode === "delivery" && f.address.trim().length < 5) errs.address = "Укажите адрес доставки";
    if (!f.consent) errs.consent = "Нужно согласие на обработку данных";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById("co-" + Object.keys(errs)[0])?.focus();
      return;
    }
    setSending(true);
    setServerError("");
    const res = await postJSON("/api/order", { ...f, mode, website: hp, items: lines.map((l) => ({ slug: l.dish.slug, qty: l.qty })) });
    setSending(false);
    if (res.ok) {
      setDoneTotal(total);
      cart.clear();
      setStep("done");
    } else {
      if (res.errors) setErrors(res.errors);
      setServerError(res.error || "Проверьте поля формы");
    }
  }

  return (
    <>
      <div className="drawer-head">
        <h2 id="cart-title" className="title">
          {step === "checkout" ? "Оформление" : "Ваш заказ"}
        </h2>
        <IconButton icon="close" variant="outline" label="Закрыть" onClick={onClose} />
      </div>

      {step === "done" ? (
        <div className="drawer-empty" role="status">
          <Ornament size={72} className="accent-orn" />
          <h3 className="title">Заказ принят</h3>
          <p className="muted">
            {f.name.trim()}, спасибо. Администратор перезвонит на {formatPhone(f.phone)}, подтвердит заказ на {formatPrice(doneTotal)} и назовёт время {mode === "delivery" ? "доставки" : "готовности"}.
          </p>
          <Button variant="outline" onClick={onClose}>
            Вернуться на сайт
          </Button>
        </div>
      ) : !lines.length ? (
        <div className="drawer-empty">
          <Ornament size={72} className="accent-orn" />
          <h3 className="title">Здесь пока пусто</h3>
          <p className="muted">Добавьте блюда из меню — соберём заказ на доставку или к вашему приходу.</p>
          <Button href="/menu" variant="primary" icon="arrow-right" onClick={onClose}>
            Смотреть меню
          </Button>
        </div>
      ) : step === "cart" ? (
        <>
          <ul className="cart-lines">
            {lines.map(({ dish, qty }) => (
              <li key={dish.slug} className="cart-line">
                <button type="button" className={`cart-thumb ag-photo-${dish.tone}`} onClick={() => { onClose(); openDish(dish.slug); }} aria-label={`Открыть «${dish.name}»`}>
                  <Ornament size={36} strokeWidth={4} />
                </button>
                <div className="cart-line-text">
                  <b>{dish.name}</b>
                  <span className="muted small">
                    {formatPrice(dish.price)} · {dish.weight}
                  </span>
                </div>
                <div className="cart-line-side">
                  <span className="price-sm">{formatPrice(dish.price * qty)}</span>
                  <Stepper qty={qty} name={dish.name} onAdd={() => cart.add(dish.slug)} onRemove={() => cart.remove(dish.slug)} />
                </div>
              </li>
            ))}
          </ul>
          <div className="drawer-foot">
            <div className="cart-total">
              <span>
                {count} {plural(count, "позиция", "позиции", "позиций")}
              </span>
              <b className="price">{formatPrice(total)}</b>
            </div>
            <Button variant="primary" size="lg" icon="arrow-right" block onClick={() => setStep("checkout")}>
              Оформить заказ
            </Button>
            <button type="button" className="link-btn" onClick={() => cart.clear()}>
              Очистить заказ
            </button>
          </div>
        </>
      ) : (
        <form className="checkout" onSubmit={submit} noValidate>
          <div className="seg" role="radiogroup" aria-label="Способ получения">
            {(["pickup", "delivery"] as Mode[]).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? "is-on" : ""} onClick={() => setMode(m)}>
                {m === "pickup" ? "Самовывоз" : "Доставка"}
              </button>
            ))}
          </div>
          <p className="small muted">{mode === "pickup" ? `Заберите заказ по адресу: ${site.address}.` : "Стоимость и время доставки администратор назовёт по телефону."}</p>
          <Field id="co-name" label="Имя" error={errors.name}>
            <input id="co-name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Как к вам обращаться" aria-invalid={!!errors.name} />
          </Field>
          <Field id="co-phone" label="Телефон" error={errors.phone}>
            <input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", formatPhone(e.target.value))} placeholder="+7" aria-invalid={!!errors.phone} />
          </Field>
          {mode === "delivery" ? (
            <Field id="co-address" label="Адрес" error={errors.address}>
              <input id="co-address" autoComplete="street-address" value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="Улица, дом, квартира" aria-invalid={!!errors.address} />
            </Field>
          ) : null}
          <Field id="co-comment" label="Комментарий">
            <textarea id="co-comment" rows={2} value={f.comment} onChange={(e) => set("comment", e.target.value)} placeholder="К какому времени, сдача, пожелания" />
          </Field>
          <Consent id="co-consent" checked={f.consent} onChange={(c) => set("consent", c)} error={errors.consent} />
          <Honeypot value={hp} onChange={setHp} />
          {serverError ? (
            <p className="form-error" role="alert">
              {serverError}
            </p>
          ) : null}
          <div className="drawer-foot">
            <div className="cart-total">
              <span>
                {count} {dishCountLabel("", count)}
              </span>
              <b className="price">{formatPrice(total)}</b>
            </div>
            <Button type="submit" variant="primary" size="lg" icon="arrow-right" block disabled={sending}>
              {sending ? "Отправляем…" : "Отправить заказ"}
            </Button>
            <button type="button" className="link-btn" onClick={() => setStep("cart")}>
              Вернуться к составу
            </button>
          </div>
        </form>
      )}
    </>
  );
}
