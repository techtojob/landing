import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NewsSection } from "@/components/news-section";
import { JoinCta, PageHero, PageShell } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

const path = "/noticias";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("news");
  return pageMetadata({ title: t("indexMetaTitle"), description: t("indexIntro"), path });
}

export default async function NewsIndexPage() {
  const t = await getTranslations();

  return (
    <PageShell>
      <PageHero title={t("news.indexTitle")} lead={t("news.indexIntro")} crumbs={[{ label: t("navigation.news"), href: path }]} action={false} />
      <NewsSection index />
      <JoinCta />
    </PageShell>
  );
}
