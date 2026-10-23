import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FaqSection, type FaqItem } from "@/components/faq";
import { TournamentsSection } from "@/components/tournaments";
import { ContentBlocks, JoinCta, PageHero, PageShell, type ContentBlock } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

const path = "/torneos";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.tournaments");
  return pageMetadata({ title: t("metaTitle"), description: t("metaDescription"), path });
}

export default async function TournamentsPage() {
  const t = await getTranslations();

  return (
    <PageShell>
      <PageHero title={t("pages.tournaments.title")} lead={t("pages.tournaments.lead")} crumbs={[{ label: t("navigation.tournaments"), href: path }]} />
      <TournamentsSection />
      <ContentBlocks blocks={t.raw("pages.tournaments.blocks") as ContentBlock[]} />
      <FaqSection items={t.raw("pages.tournaments.faq") as FaqItem[]} />
      <JoinCta />
    </PageShell>
  );
}
