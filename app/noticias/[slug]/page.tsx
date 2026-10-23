import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { NewsLink } from "@/components/news-link";
import { JoinCta, PageHero, PageShell } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";
import { news } from "@/lib/news";
import { site, siteUrl } from "@/lib/site";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return news.es.items.map((item) => ({ slug: item.slug }));
}

const findItem = (slug: string) => news.es.items.find((item) => item.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = findItem((await params).slug);
  if (!item) return {};
  const metadata = pageMetadata({ title: item.title, description: item.summary, path: `/noticias/${item.slug}`, type: "article" });
  // Los titulares largos van sin el sufijo "| TechToJob" para que Google no los corte.
  return item.title.length > 48 ? { ...metadata, title: { absolute: item.title } } : metadata;
}

export default async function NewsArticlePage({ params }: Props) {
  const item = findItem((await params).slug);
  if (!item) notFound();

  const t = await getTranslations();
  const path = `/noticias/${item.slug}`;
  const image = "image" in item ? item.image : undefined;

  const others = news.es.items.filter((other) => other.slug !== item.slug);

  return (
    <PageShell>
      <article>
        <PageHero
          title={item.title}
          crumbs={[{ label: t("navigation.news"), href: "/noticias" }, { label: item.category, href: path }]}
          action={false}
          meta={(
            <p className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-ink">{item.category}</span>
              <time className="text-white/70" dateTime={item.date}>{item.dateLabel}</time>
            </p>
          )}
        />
        <div className="section-grid bg-slate px-[var(--page-gutter)] pb-[clamp(5rem,10vw,9rem)] text-white">
          <div className="mx-auto grid max-w-[80rem] items-start gap-12 min-[64rem]:grid-cols-[1fr_20rem] min-[64rem]:gap-14">
            <div className="relative z-10 -mt-8 overflow-hidden rounded-2xl bg-white text-ink shadow-card min-[64rem]:-mt-10">
              {image && (
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 900px, 100vw" priority className="aspect-[1200/630] w-full object-cover" />
              )}
              <div className="grid max-w-[68ch] gap-5 p-[clamp(1.5rem,4vw,3.5rem)] text-lg leading-relaxed text-ink/85 [&>p:first-child]:text-[clamp(1.25rem,2.2vw,1.6rem)] [&>p:first-child]:font-bold [&>p:first-child]:leading-snug [&>p:first-child]:tracking-[-.015em] [&>p:first-child]:text-ink">
                {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>

            <div className="grid gap-8 min-[64rem]:sticky min-[64rem]:top-28 min-[64rem]:pt-[clamp(3rem,6vw,5rem)]">
              <aside data-swing-card className="relative rotate-[1.5deg] rounded-2xl bg-postit p-6 text-ink shadow-card">
                <Image src="/images/pin.svg" alt="" width={32} height={36} data-swing-pin className="absolute -top-5 left-8 h-9 w-auto" />
                <p className="text-xl font-bold leading-tight tracking-[-.02em]">{t("news.linksTitle")}</p>
                <ul className="mt-2 grid">
                  {item.links.map((link) => (
                    <li key={link.url}><NewsLink href={link.url} label={link.label} /></li>
                  ))}
                </ul>
              </aside>
              <NewsLink href="/noticias" label={`← ${t("news.back")}`} className="text-white hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </article>

      <section className="bg-ink px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)]" aria-labelledby="more-news-heading">
        <div className="mx-auto max-w-[80rem]">
          <h2 id="more-news-heading" className="font-bold tracking-[-.035em]">{t("news.more")}</h2>
          <div className="mt-12 grid gap-6 min-[48rem]:grid-cols-2">
            {others.map((other, index) => (
              <article key={other.slug} className={`flex flex-col rounded-2xl bg-white p-6 text-ink shadow-card min-[40rem]:p-8 ${index % 2 ? "rotate-[.6deg]" : "-rotate-[.6deg]"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-ink">{other.category}</span>
                  <time className="text-xs text-ink/75" dateTime={other.date}>{other.dateLabel}</time>
                </div>
                <h3 className="mt-5 text-balance text-[clamp(1.25rem,2vw,1.65rem)] font-bold leading-tight tracking-[-.025em]">
                  <Link href={`/noticias/${other.slug}`} className="underline-offset-4 hover:underline">{other.title}</Link>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/80">{other.summary}</p>
                <div className="mt-auto pt-4"><NewsLink href={`/noticias/${other.slug}`} label={t("news.readMore")} /></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <JoinCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          description: item.summary,
          datePublished: item.date,
          inLanguage: "es",
          mainEntityOfPage: `${siteUrl}${path}`,
          image: `${siteUrl}/images/og-cover.png`,
          author: { "@type": "Organization", name: site.name, url: siteUrl },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${siteUrl}/images/brand-mark-512.png` } },
        }}
      />
    </PageShell>
  );
}
