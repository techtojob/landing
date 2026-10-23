"use client";

import { useEffect, useState } from "react";
import { apiUrl, bolsa } from "@/lib/site";

type Oferta = {
  id: string;
  slug: string;
  titulo: string;
  empresa: { nombre: string };
  modalidad: string;
  ciudad: string | null;
  publicadaEn: string;
};
type Proyecto = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  portada: string | null;
  autor: { nombre: string };
  megusta: number;
  megustaPeriodo?: number;
};
type Textos = {
  title: string;
  lead: string;
  offers: string;
  allOffers: string;
  projects: string;
  newProjects: string;
  allProjects: string;
  likes: string;
  modalidades: Record<string, string>;
};

/**
 * "Ahora en la bolsa": las últimas ofertas y los proyectos que más gustan este mes, sacados en directo
 * del API de la bolsa. La landing es estática, así que se piden desde el navegador.
 * - Si este mes aún no hay 3 proyectos con me gusta, salen los 3 más nuevos ("Proyectos nuevos").
 * - Con menos de 3 proyectos, esa columna no sale (mejor nada que una lista casi vacía).
 * - Si el API no responde (o aún no hay nada), no sale la sección.
 */
export function LiveBoard({ text }: Readonly<{ text: Textos }>) {
  const [ofertas, setOfertas] = useState<Oferta[] | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null);
  const [delMes, setDelMes] = useState(true);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    const pedir = <T,>(ruta: string) =>
      fetch(`${apiUrl}${ruta}`).then((r) =>
        r.ok
          ? (r.json() as Promise<T>)
          : Promise.reject(new Error(String(r.status))),
      );
    Promise.allSettled([
      pedir<{ ofertas: Oferta[] }>("/ofertas?idiomas=es,en&limite=4").then(
        (r) => setOfertas(r.ofertas.slice(0, 4)),
      ),
      pedir<{ proyectos: Proyecto[] }>("/proyectos?orden=mes").then(
        async (r) => {
          const conMegusta = r.proyectos.filter(
            (p) => (p.megustaPeriodo ?? 0) > 0,
          );
          if (conMegusta.length >= 3)
            return setProyectos(conMegusta.slice(0, 3));
          const nuevos = (
            await pedir<{ proyectos: Proyecto[] }>("/proyectos?orden=nuevos")
          ).proyectos;
          setDelMes(false);
          setProyectos(nuevos.length >= 3 ? nuevos.slice(0, 3) : []);
        },
      ),
    ]).then((r) => r.every((x) => x.status === "rejected") && setFallo(true));
  }, []);

  const cargando = ofertas === null && proyectos === null && !fallo;
  if (fallo || (!cargando && !ofertas?.length && !proyectos?.length))
    return null;
  const conOfertas = cargando || !!ofertas?.length;
  const conProyectos = cargando || !!proyectos?.length;

  return (
    <section
      aria-labelledby="live-board-heading"
      className="px-[var(--page-gutter)] py-[clamp(4rem,8vw,7rem)] text-white"
    >
      <div className="mx-auto max-w-[80rem]">
        <h2 id="live-board-heading" className="font-bold tracking-[-.035em]">
          {text.title}
        </h2>
        <p className="mt-3 max-w-[60ch] text-white/75">{text.lead}</p>
        <div
          className={`mt-10 grid gap-10 ${conOfertas && conProyectos ? "min-[64rem]:grid-cols-[1.2fr_1fr]" : ""}`}
        >
          {conOfertas && (
            <div aria-busy={cargando} className="flex min-w-0 flex-col gap-4">
              <h3 className="text-xl font-bold">{text.offers}</h3>
              <ul className="grid gap-3">
                {cargando
                  ? [0, 1, 2, 3].map((i) => (
                      <li
                        key={i}
                        className="h-[5.5rem] animate-pulse rounded-2xl bg-white/8"
                      />
                    ))
                  : ofertas?.map((o) => (
                      <li key={o.id}>
                        <a
                          href={bolsa.oferta(o.slug, o.id)}
                          className="group flex flex-col gap-1 rounded-2xl border border-ink/15 bg-white p-5 text-ink transition hover:-translate-y-0.5"
                        >
                          <span className="text-sm font-bold text-ink/70">
                            {o.empresa.nombre}
                          </span>
                          <span className="text-lg font-bold leading-tight group-hover:underline">
                            {o.titulo}
                          </span>
                          <span className="text-sm text-ink/70">
                            {[
                              text.modalidades[o.modalidad] ?? o.modalidad,
                              o.ciudad,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </a>
                      </li>
                    ))}
              </ul>
              <a
                href={bolsa.ofertas}
                className="self-start rounded-full bg-primary px-5 py-3 text-sm font-bold text-ink hover:brightness-105"
              >
                {text.allOffers}
              </a>
            </div>
          )}
          {conProyectos && (
            <div aria-busy={cargando} className="flex min-w-0 flex-col gap-4">
              <h3 className="text-xl font-bold">
                {delMes ? text.projects : text.newProjects}
              </h3>
              <ul className="grid gap-3">
                {cargando
                  ? [0, 1, 2].map((i) => (
                      <li
                        key={i}
                        className="h-[7.5rem] animate-pulse rounded-2xl bg-white/8"
                      />
                    ))
                  : proyectos?.map((p, i) => (
                      <li key={p.id}>
                        <a
                          href={bolsa.proyecto(p.slug, p.id)}
                          className="group grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-white/6 p-3 transition hover:bg-white/10"
                        >
                          <span className="relative block aspect-[2/1] w-32 overflow-hidden rounded-xl bg-white/10 min-[30rem]:w-40">
                            {p.portada ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.portada}
                                alt=""
                                loading="lazy"
                                className="size-full object-cover"
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                            ) : null}
                            {delMes && (
                              <span className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-postit text-xs font-bold text-ink">
                                #{i + 1}
                              </span>
                            )}
                          </span>
                          <span className="flex min-w-0 flex-col gap-1">
                            <span className="line-clamp-2 font-bold leading-tight group-hover:underline">
                              {p.titulo}
                            </span>
                            <span className="truncate text-sm text-white/70">
                              {p.autor.nombre}
                            </span>
                            <span className="text-sm font-bold text-primary">
                              ♥{" "}
                              {text.likes.replace("{count}", String(p.megusta))}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
              </ul>
              <a
                href={bolsa.proyectos}
                className="self-start rounded-full border border-white/25 px-5 py-3 text-sm font-bold hover:border-primary hover:text-primary"
              >
                {text.allProjects}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
