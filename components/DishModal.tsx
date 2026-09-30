"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { getDish } from "@/lib/menu";
import { DishDetails } from "./DishDetails";
import { closeDish, dishHistory } from "./ui-state";
import { useDialog } from "./useDialog";

export function DishModal() {
  const params = useSearchParams();
  const slug = params.get("dish");
  const dish = slug ? getDish(slug) : undefined;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPop = () => {
      dishHistory.pushed = 0;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useDialog(!!dish, closeDish, ref);

  if (!dish) return null;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && closeDish()}>
      <div className="dish-modal" role="dialog" aria-modal="true" aria-labelledby="dish-modal-title" ref={ref} tabIndex={-1} key={dish.slug}>
        <DishDetails dish={dish} onClose={closeDish} headingId="dish-modal-title" />
      </div>
    </div>
  );
}
