"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Badge, Icon, IconButton, PhotoSlot } from "@/components/ds";
import { cart, useCart } from "@/lib/cart-store";
import { formatPrice, type Dish } from "@/lib/menu";
import { useOpenDish } from "./ui-state";

export function Stepper({ qty, name, onAdd, onRemove, className }: { qty: number; name: string; onAdd: () => void; onRemove: () => void; className?: string }) {
  return (
    <div className={"ag-stepper " + (className || "")} onClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label={`Убрать одну порцию «${name}»`} onClick={onRemove}>
        <Icon name="minus" size={16} />
      </button>
      <span aria-live="polite">{qty}</span>
      <button type="button" aria-label={`Добавить ещё «${name}»`} onClick={onAdd}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export function DishCard({ dish, compact, className }: { dish: Dish; compact?: boolean; className?: string }) {
  const { items } = useCart();
  const qty = items[dish.slug] || 0;
  const openDish = useOpenDish();

  function onNameClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      e.stopPropagation();
      return;
    }
    e.preventDefault();
  }

  return (
    <article className={["ag-dish", compact && "ag-dish-compact", className].filter(Boolean).join(" ")} onClick={() => openDish(dish.slug)} style={{ cursor: "pointer" }}>
      <div className="ag-dish-media">
        <PhotoSlot src={dish.image} alt={dish.name} label={dish.image ? null : dish.photoLabel} tone={dish.tone} ratio={compact ? "1 / 1" : "4 / 3"} radius="md" />
        {dish.badges.length ? (
          <div className="ag-dish-badges">
            {dish.badges.map((b) => (
              <Badge key={b} tone={b} onPhoto />
            ))}
          </div>
        ) : null}
      </div>
      <div className="ag-dish-body">
        <h3 className="ag-dish-name">
          <Link href={`/menu/${dish.slug}`} onClick={onNameClick} className="ag-dish-link">
            {dish.name}
          </Link>
        </h3>
        {dish.description && !compact ? <p className="ag-dish-desc">{dish.description}</p> : null}
        <div className="ag-dish-foot">
          <div className="ag-dish-meta">
            <span className="ag-dish-price">
              {dish.oldPrice ? <s className="ag-dish-old">{formatPrice(dish.oldPrice)}</s> : null}
              {formatPrice(dish.price)}
            </span>
            {dish.weight ? <span className="ag-dish-weight">{dish.weight}</span> : null}
          </div>
          {qty > 0 ? (
            <Stepper qty={qty} name={dish.name} onAdd={() => cart.add(dish.slug)} onRemove={() => cart.remove(dish.slug)} />
          ) : (
            <IconButton
              icon="plus"
              label={`Добавить «${dish.name}» в заказ`}
              onClick={(e) => {
                e.stopPropagation();
                cart.add(dish.slug);
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
