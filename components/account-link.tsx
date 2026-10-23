"use client";

import { useEffect, useState } from "react";
import { bolsa } from "@/lib/site";

/**
 * "Entrar" o, si ya ha entrado en la bolsa, "Mi cuenta" con su inicial. La sesión es de techtojob.com
 * (la cookie la pone la bolsa), así que se pregunta en el navegador; mientras tanto se ve "Entrar".
 */
export function AccountLink({ loginLabel, accountLabel, className = "" }: Readonly<{ loginLabel: string; accountLabel: string; className?: string }>) {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/get-session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user?: { name?: string } } | null) => {
        if (!cancelled && data?.user?.name) setName(data.user.name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!name) {
    return (
      <a href={bolsa.entrar} className={`items-center rounded-full border border-white/25 px-4 text-sm font-bold transition-colors hover:border-primary hover:text-primary ${className}`}>
        {loginLabel}
      </a>
    );
  }
  return (
    <a href={bolsa.cuenta} className={`items-center gap-2 rounded-full bg-white/8 pl-1.5 pr-4 text-sm font-bold transition-colors hover:text-primary ${className}`} aria-label={accountLabel}>
      <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-primary text-ink">
        {name.trim().charAt(0).toUpperCase()}
      </span>
      <span className="max-w-28 truncate">{name.split(" ")[0]}</span>
    </a>
  );
}
