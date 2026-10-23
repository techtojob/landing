import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TalentSection } from "@/components/audience-sides";
import { HowItWorks } from "@/components/how-it-works";
import { ContentBlocks, JoinCta, PageHero, PageShell, type ContentBlock } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

const path = "/talento";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.talent");
  return pageMetadata({ title: t("metaTitle"), description: t("metaDescription"), path });
}

export default async function TalentPage() {
  const t = await getTranslations();

  return (
    <PageShell>
      <PageHero title={t("pages.talent.title")} lead={t("pages.talent.lead")} crumbs={[{ label: t("navigation.talent"), href: path }]} />
      <HowItWorks />
      <TalentSection />
      <ContentBlocks blocks={t.raw("pages.talent.blocks") as ContentBlock[]} />
      <JoinCta />
    </PageShell>
  );
}
