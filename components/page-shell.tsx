import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { AnimatedButtonLabel } from "@/components/animated-button-label";
import { CardSwing } from "@/components/card-swing";
import { SiteFooter } from "@/components/community-sections";
import { JsonLd } from "@/components/json-ld";
import { ScrollExperience } from "@/components/scroll-experience";
import { SiteHeader } from "@/components/site-header";
import { site, siteUrl } from "@/lib/site";

type Crumb = { label: string; href: string };

/** Marco común de las páginas interiores: cabecera, contenido y pie. */
export async function PageShell({ children }: Readonly<{ children: ReactNode }>) {
  const t = await getTranslations("navigation");

  return (
    <div className="relative isolate overflow-x-clip">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"
      >
        {t("skipToContent")}
      </a>
      <SiteHeader home={false} />
      <main id="content">{children}</main>
      <SiteFooter />
      <ScrollExperience />
      <CardSwing />
    </div>
  );
}

/** Cabecera de página interior: migas, H1 y entradilla. */
export async function PageHero({ title, lead, crumbs, meta, action = true, schema = true }: Readonly<{
  title: string;
  lead?: string;
  crumbs: Crumb[];
  meta?: ReactNode;
  action?: boolean;
  schema?: boolean;
}>) {
  const t = await getTranslations();
  const trail: Crumb[] = [{ label: t("navigation.home"), href: "/" }, ...crumbs];

  return (
    <section className="relative isolate -mt-[4.25rem] overflow-hidden px-[var(--page-gutter)] pb-[clamp(3.5rem,7vw,6rem)] pt-[calc(4.25rem+clamp(3rem,7vw,6rem))] [background:radial-gradient(circle_at_78%_24%,rgba(132,192,191,.18),transparent_31rem),linear-gradient(180deg,#2f3436_0%,#292e30_100%)] min-[50rem]:-mt-[5.25rem] min-[50rem]:pt-[calc(5.25rem+clamp(3rem,7vw,6rem))]">
      <div className="mx-auto flex max-w-[80rem] flex-col items-start">
        <nav aria-label={t("navigation.breadcrumb")}>
          <ol className="flex flex-wrap items-center gap-x-2 text-sm font-bold text-white/60">
            {trail.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {index === trail.length - 1
                  ? <span aria-current="page" className="inline-flex min-h-11 items-center text-primary">{crumb.label}</span>
                  : <Link href={crumb.href} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-primary">{crumb.label}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-3 max-w-[18ch] text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-bold tracking-[-.04em]">{title}</h1>
        {meta}
        {lead && <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-white/75">{lead}</p>}
        {action && (
          <a href={site.discord} className="group/action relative mt-9 inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full bg-primary px-7 text-base font-bold text-ink">
            <Image src="/images/discord-dark.svg" alt="" width={22} height={22} />
            <AnimatedButtonLabel text={t("community.join")} />
          </a>
        )}
      </div>
      {schema && <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: `${siteUrl}${crumb.href === "/" ? "" : crumb.href}`,
          })),
        }}
      />}
    </section>
  );
}

export type ContentBlock = { title: string; paragraphs: string[]; list?: string[] };

/** Bloques de texto de una página interior. */
export function ContentBlocks({ blocks }: Readonly<{ blocks: ContentBlock[] }>) {
  return (
    <section className="section-grid bg-slate px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)] text-white">
      <div className="mx-auto grid max-w-[80rem] gap-14">
        {blocks.map((block) => (
          <div key={block.title} className="grid gap-5 min-[60rem]:grid-cols-[.8fr_1.2fr] min-[60rem]:gap-16">
            <h2 className="text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-bold tracking-[-.03em]">{block.title}</h2>
            <div className="grid max-w-[65ch] gap-4 text-lg leading-relaxed text-white/80">
              {block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {block.list && (
                <ul className="grid gap-3">
                  {block.list.map((entry) => (
                    <li key={entry} className="flex gap-3"><span aria-hidden="true" className="mt-[.7em] size-2.5 shrink-0 rounded-full bg-primary" />{entry}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Llamada final al Discord. */
export async function JoinCta() {
  const t = await getTranslations("pages.cta");

  return (
    <section className="bg-primary px-[var(--page-gutter)] py-[clamp(4rem,8vw,7rem)] text-ink">
      <div className="mx-auto flex max-w-[80rem] flex-wrap items-end justify-between gap-8">
        <div>
          <h2 className="max-w-[14ch] text-balance font-bold tracking-[-.035em]">{t("title")}</h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink/85">{t("description")}</p>
        </div>
        <a href={site.discord} className="group/action relative inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full bg-ink px-7 text-base font-bold text-white">
          <Image src="/images/discord-light.svg" alt="" width={22} height={17} />
          <AnimatedButtonLabel text={t("button")} />
        </a>
      </div>
    </section>
  );
}
