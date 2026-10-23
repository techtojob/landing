import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CompaniesSection } from "@/components/audience-sides";
import { ContentBlocks, JoinCta, PageHero, PageShell, type ContentBlock } from "@/components/page-shell";
import { pageMetadata } from "@/lib/metadata";

const path = "/empresas";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.companies");
  return pageMetadata({ title: t("metaTitle"), description: t("metaDescription"), path });
}

export default async function CompaniesPage() {
  const t = await getTranslations();

  return (
    <PageShell>
      <PageHero title={t("pages.companies.title")} lead={t("pages.companies.lead")} crumbs={[{ label: t("navigation.companies"), href: path }]} />
      <CompaniesSection />
      <ContentBlocks blocks={t.raw("pages.companies.blocks") as ContentBlock[]} />
      <JoinCta />
    </PageShell>
  );
}
