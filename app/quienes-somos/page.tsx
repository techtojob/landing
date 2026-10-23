import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CommunityAvatar } from "@/components/community-avatar";
import { JsonLd } from "@/components/json-ld";
import { NewsLink } from "@/components/news-link";
import { JoinCta, PageHero, PageShell } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";
import { owner, site, siteUrl } from "@/lib/site";

const path = "/quienes-somos";

type Fact = { value: string; label: string };
type Milestone = { date: string; title: string; text: string };
type Work = { title: string; text: string };
type Winner = { tournament: string; name: string; what: string; slug: string };

const factTones = [
  "bg-postit text-ink -rotate-[1.5deg]",
  "bg-white text-ink rotate-[1deg]",
  "bg-primary text-ink -rotate-[.8deg]",
  "bg-white text-ink rotate-[1.4deg]",
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.about");
  return pageMetadata({ title: t("metaTitle"), description: t("metaDescription"), path });
}

function Pin({ className }: Readonly<{ className: string }>) {
  return <Image src="/images/pin.svg" alt="" width={32} height={36} data-swing-pin className={`absolute h-9 w-auto ${className}`} />;
}

export default async function AboutPage() {
  const t = await getTranslations();
  const facts = t.raw("pages.about.facts") as Fact[];
  const intro = t.raw("pages.about.intro") as { title: string; paragraphs: string[]; quote: string; quoteLabel: string };
  const story = t.raw("pages.about.story") as { title: string; paragraphs: string[]; timeline: Milestone[] };
  const work = t.raw("pages.about.work") as { title: string; items: Work[] };
  const winners = t.raw("pages.about.winners") as { title: string; text: string; label: string; link: string; items: Winner[] };

  return (
    <PageShell>
      <PageHero title={t("pages.about.title")} lead={t("pages.about.lead")} crumbs={[{ label: t("navigation.about"), href: path }]} />

      {/* Cifras: notas pinchadas, como los pasos de "Cómo funciona" */}
      <section className="bg-ink px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)]" aria-labelledby="facts-heading">
        <div className="mx-auto max-w-[80rem]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="facts-heading" className="font-bold tracking-[-.035em]">{t("pages.about.factsTitle")}</h2>
            <p className="text-sm text-white/65">{t("pages.about.factsNote")}</p>
          </div>
          <dl className="mt-16 grid gap-x-6 gap-y-12 min-[40rem]:grid-cols-2 min-[68rem]:grid-cols-4">
            {facts.map((fact, index) => (
              <div key={fact.label} data-swing-card className={`relative flex flex-col-reverse justify-end gap-4 rounded-2xl p-7 shadow-card ${factTones[index % factTones.length]}`}>
                <Pin className="-top-5 left-1/2 -translate-x-1/2" />
                <dt className="text-sm font-bold leading-snug text-ink/80">{fact.label}</dt>
                <dd className="text-[clamp(3rem,4.3vw,3.9rem)] font-bold leading-none tracking-[-.05em]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Qué es: texto y la idea en una tarjeta */}
      <section className="section-grid relative overflow-hidden bg-slate px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)] text-white" aria-labelledby="intro-heading">
        <div className="mx-auto grid max-w-[80rem] items-center gap-16 min-[64rem]:grid-cols-[.9fr_1.1fr]">
          <div>
            <h2 id="intro-heading" className="max-w-[11ch] text-balance font-bold tracking-[-.035em]">{intro.title}</h2>
            <div className="mt-6 grid max-w-[52ch] gap-4 text-lg leading-relaxed text-white/80">
              {intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[36rem] py-8">
            <div className="absolute inset-x-[6%] inset-y-0 rotate-[6deg] animate-orbit rounded-[50%] border-2 border-dashed border-primary" aria-hidden="true" />
            <figure data-swing-card className="relative z-10 -rotate-[2deg] rounded-2xl bg-white p-8 text-ink shadow-card min-[40rem]:p-10">
              <Pin className="-top-5 left-10" />
              <figcaption className="text-sm font-bold text-ink/70">{intro.quoteLabel}</figcaption>
              <blockquote className="mt-3 text-balance text-[clamp(1.8rem,3.4vw,2.75rem)] font-bold leading-[1.05] tracking-[-.03em]">{intro.quote}</blockquote>
            </figure>
            <CommunityAvatar name="about talent" size={72} className="floating-avatar absolute -top-2 right-6 z-20 size-[4.5rem] drop-shadow-xl" />
            <CommunityAvatar name="about company" size={64} className="floating-avatar absolute -bottom-1 left-4 z-20 size-16 drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* Cómo empezó: línea de tiempo */}
      <section className="bg-ink px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)]" aria-labelledby="story-heading">
        <div className="mx-auto grid max-w-[80rem] gap-14 min-[64rem]:grid-cols-[.8fr_1.2fr] min-[64rem]:gap-16">
          <div className="min-[64rem]:sticky min-[64rem]:top-32 min-[64rem]:self-start">
            <h2 id="story-heading" className="max-w-[9ch] text-balance font-bold tracking-[-.035em]">{story.title}</h2>
            <div className="mt-6 grid max-w-[44ch] gap-4 text-lg leading-relaxed text-white/72">
              {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph.replace("{founder}", owner.name)}</p>)}
            </div>
          </div>
          <ol className="relative grid gap-5 before:absolute before:bottom-6 before:left-[1.1rem] before:top-6 before:border-l-2 before:border-dashed before:border-primary/60">
            {story.timeline.map((step, index) => (
              <li key={step.title} className="relative grid grid-cols-[2.25rem_1fr] items-start gap-4 min-[40rem]:gap-6">
                <span aria-hidden="true" className={`relative z-10 mt-5 flex size-9 items-center justify-center rounded-full text-xs font-bold ${index === story.timeline.length - 1 ? "bg-primary text-ink" : "bg-white text-ink"}`}>{index + 1}</span>
                <div className={`rounded-2xl p-6 ${index === story.timeline.length - 1 ? "bg-primary text-ink" : "bg-white/6 ring-1 ring-inset ring-white/10"}`}>
                  <p className={`text-sm font-bold ${index === story.timeline.length - 1 ? "text-ink/80" : "text-primary"}`}>{step.date}</p>
                  <h3 className="mt-1 text-[clamp(1.3rem,2.2vw,1.7rem)] font-bold leading-tight tracking-[-.02em]">{step.title}</h3>
                  <p className={`mt-2 max-w-[52ch] leading-relaxed ${index === story.timeline.length - 1 ? "text-ink" : "text-white/75"}`}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Qué hacemos */}
      <section className="section-grid bg-slate px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)] text-white" aria-labelledby="work-heading">
        <div className="mx-auto max-w-[80rem]">
          <h2 id="work-heading" className="font-bold tracking-[-.035em]">{work.title}</h2>
          <ul className="mt-12 grid gap-5 min-[48rem]:grid-cols-2">
            {work.items.map((item) => (
              <li key={item.title} className="flex gap-4 rounded-2xl bg-ink p-7 shadow-card min-[40rem]:p-8">
                <Image src="/images/check.svg" alt="" width={22} height={26} className="mt-1 h-6 w-auto shrink-0" />
                <div>
                  <h3 className="text-[clamp(1.3rem,2.2vw,1.7rem)] font-bold leading-tight tracking-[-.02em]">{item.title}</h3>
                  <p className="mt-2 max-w-[48ch] leading-relaxed text-white/75">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ganadores de los torneos */}
      <section className="bg-ink px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)]" aria-labelledby="winners-heading">
        <div className="mx-auto max-w-[80rem]">
          <div className="grid gap-6 min-[60rem]:grid-cols-[1.2fr_.8fr] min-[60rem]:items-end">
            <h2 id="winners-heading" className="max-w-[13ch] text-balance font-bold tracking-[-.035em]">{winners.title}</h2>
            <p className="max-w-[44ch] text-lg leading-relaxed text-white/72">{winners.text}</p>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-12 min-[48rem]:grid-cols-2">
            {winners.items.map((winner, index) => (
              <article key={winner.slug} data-swing-card className={`relative flex flex-col rounded-2xl p-7 text-ink shadow-card min-[40rem]:p-9 ${index % 2 ? "rotate-[1deg] bg-postit" : "-rotate-[1deg] bg-white"}`}>
                <Pin className="-top-5 left-10" />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink/75">{winner.tournament}</p>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold">#{index + 1}</span>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <CommunityAvatar name={winner.name} size={56} className="size-14 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-ink/75">{winners.label}</p>
                    <h3 className="text-[clamp(1.6rem,2.8vw,2.25rem)] font-bold leading-none tracking-[-.03em]">{winner.name}</h3>
                  </div>
                </div>
                <p className="mt-5 max-w-[44ch] leading-relaxed text-ink/85">{winner.what}</p>
                <div className="mt-auto pt-3"><NewsLink href={`/noticias/${winner.slug}`} label={winners.link} /></div>
              </article>
            ))}
          </div>
          <p className="mt-14 text-lg text-white/75">
            {t("pages.about.contact")}{" "}
            <a href={`mailto:${site.email}`} className="font-bold text-white underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary">{site.email}</a>.
          </p>
        </div>
      </section>

      <JoinCta />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", url: `${siteUrl}${path}`, name: t("pages.about.metaTitle"), inLanguage: "es", about: { "@type": "Organization", name: "TechToJob", url: siteUrl } }} />
    </PageShell>
  );
}
