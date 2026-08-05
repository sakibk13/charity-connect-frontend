"use client";

import { useEffect, useRef, useState } from "react";

import { useCurrency } from "@/components/site/currency-context";
import { CURRENCIES, CURRENCY_ORDER, type CurrencyCode } from "@/lib/currency";

export function CurrencyPicker({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const select = (code: CurrencyCode) => {
    setCurrency(code);
    setOpen(false);
  };

  return (
    <div className={`pt-currency-picker ${className}`} ref={rootRef}>
      <button
        type="button"
        className="pt-currency-select pt-currency-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <i className="fa-solid fa-globe" aria-hidden="true" />
        {currency}
        <i className={`fa-solid fa-chevron-down pt-currency-caret${open ? " open" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="pt-currency-panel" role="listbox">
          {CURRENCY_ORDER.map((code) => {
            const def = CURRENCIES[code];
            const active = code === currency;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={active}
                className={`pt-currency-item${active ? " active" : ""}`}
                onClick={() => select(code)}
              >
                <span className="pt-currency-item-symbol">{def.symbol}</span>
                <span className="pt-currency-item-code">{def.code}</span>
                <span className="pt-currency-item-name">{def.name}</span>
                {active && <i className="fa-solid fa-check pt-currency-item-check" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
