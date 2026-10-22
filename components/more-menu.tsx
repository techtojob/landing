"use client";

import { useEffect, useRef, useState } from "react";

/** "Comunidad ▾" del menú: las páginas de la landing, cada una con una línea de qué es (igual que en la bolsa). */
export function MoreMenu({ label, heading, items, current }: Readonly<{ label: string; heading?: string; items: ReadonlyArray<{ href: string; label: string; help?: string }>; current?: string }>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = items.some((item) => item.href === current);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="more-navigation"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-1 text-sm font-bold transition-colors hover:text-primary ${active ? "text-primary" : ""}`}
      >
        {label}
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        id="more-navigation"
        inert={!open}
        className={`absolute left-1/2 top-[calc(100%+1rem)] z-20 w-80 -translate-x-1/2 rounded-2xl border border-white/10 bg-ink p-2 shadow-[0_10px_36px_rgb(0_0_0/0.4)] transition duration-200 motion-reduce:transition-none ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        {heading && <p className="px-4 pb-1 pt-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-white/60">{heading}</p>}
        <ul className="grid gap-0.5">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={item.href === current ? "page" : undefined} className="group/item block rounded-xl px-4 py-2.5 hover:bg-white/8">
                <span className="block text-sm font-bold group-hover/item:text-primary group-aria-[current=page]/item:text-primary">{item.label}</span>
                {item.help && <span className="block text-xs leading-snug text-white/65">{item.help}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
