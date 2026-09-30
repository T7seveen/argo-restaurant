"use client";

import { useState } from "react";
import { Badge, Button, Icon, IconButton, Ornament, PhotoSlot } from "@/components/ds";
import { cart, useCart } from "@/lib/cart-store";
import { formatPrice, getPairings, type Dish } from "@/lib/menu";
import { Stepper } from "./DishCard";
import { useOpenDish } from "./ui-state";

const PLACEHOLDER = "[уточнить]";

export function DishDetails({ dish, onClose, headingId, asPage }: { dish: Dish; onClose?: () => void; headingId?: string; asPage?: boolean }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { items } = useCart();
  const openDish = useOpenDish();
  const pairings = getPairings(dish);
  const inCart = items[dish.slug] || 0;
  const n = dish.nutrition || {};
  const Heading = asPage ? "h1" : "h2";

  function addToOrder() {
    cart.add(dish.slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="dish-sheet">
      <div className="dish-sheet-media">
        <PhotoSlot src={dish.image} alt={dish.name} label={dish.image ? null : dish.photoLabel + " крупно"} tone={dish.tone} ratio="fill" className="dish-sheet-photo" />
        {dish.badges.length ? (
          <div className="ag-dish-badges dish-sheet-badges">
            {dish.badges.map((b) => (
              <Badge key={b} tone={b} onPhoto />
            ))}
          </div>
        ) : null}
      </div>
      <div className="dish-sheet-info">
        {onClose ? <IconButton icon="close" variant="outline" size="lg" label="Закрыть" className="dish-sheet-close" onClick={onClose} /> : null}
        <div className="overline">{dish.categoryTitle}</div>
        <Heading id={headingId} className="dish-sheet-title">
          {dish.name}
        </Heading>
        <p className="dish-sheet-desc">{dish.details || dish.description}</p>

        <dl className="dish-table">
          <div>
            <dt>Вес</dt>
            <dd>{dish.weight || PLACEHOLDER}</dd>
          </div>
          <div>
            <dt>Состав</dt>
            <dd>{dish.composition || PLACEHOLDER}</dd>
          </div>
          <div>
            <dt>Аллергены</dt>
            <dd>{dish.allergens || PLACEHOLDER}</dd>
          </div>
          <div>
            <dt>Время приготовления</dt>
            <dd>{dish.cookTime || PLACEHOLDER}</dd>
          </div>
        </dl>

        <ul className="dish-kbju" aria-label="Пищевая ценность на порцию">
          {[
            [n.kcal, "ккал"],
            [n.protein, "белки"],
            [n.fat, "жиры"],
            [n.carbs, "углеводы"],
          ].map(([v, l]) => (
            <li key={l as string}>
              <b>{v ?? "[–]"}</b>
              <span>{l}</span>
            </li>
          ))}
        </ul>

        {pairings.length ? (
          <div className="dish-pairings">
            <div className="dish-pairings-title">С этим берут</div>
            <div className="dish-pairings-list">
              {pairings.map((p) => (
                <div className="dish-pair" key={p.slug}>
                  <button type="button" className="dish-pair-open" onClick={() => openDish(p.slug)} aria-label={`Открыть «${p.name}»`}>
                    <span className={`dish-pair-thumb ag-photo-${p.tone}`}>
                      <Ornament size={40} strokeWidth={4} />
                    </span>
                    <span className="dish-pair-text">
                      <b>{p.name}</b>
                      <span>{formatPrice(p.price)}</span>
                    </span>
                  </button>
                  {items[p.slug] ? (
                    <span className="dish-pair-in" title="Уже в заказе">
                      <Icon name="check" size={16} strokeWidth={2.2} />
                      {items[p.slug]}
                    </span>
                  ) : (
                    <IconButton icon="plus" size="sm" label={`Добавить «${p.name}» в заказ`} onClick={() => cart.add(p.slug)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="dish-buy">
          <div className="dish-buy-price">
            <span className="price">{formatPrice(dish.price * qty)}</span>
            <span className="muted small">{inCart ? `в заказе: ${inCart}` : dish.weight}</span>
          </div>
          <div className="dish-buy-actions">
            <Stepper qty={qty} name={dish.name} onAdd={() => setQty((q) => Math.min(99, q + 1))} onRemove={() => setQty((q) => Math.max(1, q - 1))} className="dish-qty" />
            <Button variant="primary" size="lg" icon={added ? "check" : "bag"} onClick={addToOrder} aria-live="polite">
              {added ? "Добавлено" : "В заказ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
