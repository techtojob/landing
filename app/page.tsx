import { NewsSection } from "@/components/news-section";
import { getTranslations } from "next-intl/server";
import { CompaniesSection, TalentSection } from "@/components/audience-sides";
import {
  ClosingSection,
  NetworkingSection,
  NewsletterSection,
  SiteFooter,
  TestimonialsSection,
} from "@/components/community-sections";
import { CardSwing } from "@/components/card-swing";
import { FaqSection, type FaqItem } from "@/components/faq";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { LiveBoard } from "@/components/live-board";
import { ScrollExperience } from "@/components/scroll-experience";
import { SiteHeader } from "@/components/site-header";
import { TournamentsSection } from "@/components/tournaments";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="relative isolate overflow-x-clip">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"
      >
        {t("navigation.skipToContent")}
      </a>
      <SiteHeader />
      <main id="content">
        <Hero />
        <LiveBoard
          text={{
            title: t("liveBoard.title"),
            lead: t("liveBoard.lead"),
            offers: t("liveBoard.offers"),
            allOffers: t("liveBoard.allOffers"),
            projects: t("liveBoard.projects"),
            newProjects: t("liveBoard.newProjects"),
            allProjects: t("liveBoard.allProjects"),
            likes: t.raw("liveBoard.likes") as string,
            modalidades: t.raw("liveBoard.modalidades") as Record<string, string>,
          }}
        />
        <HowItWorks />
        <TalentSection more />
        <CompaniesSection more />
        <TournamentsSection more />
        <NetworkingSection />
        <TestimonialsSection />
        <NewsSection />
        <FaqSection items={t.raw("faq.items") as FaqItem[]} />
        <NewsletterSection />
        <ClosingSection />
      </main>
      <SiteFooter />
      <ScrollExperience />
      <CardSwing />
    </div>
  );
}
