import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { about } from "@/lib/about";
import { owner, site, siteUrl } from "@/lib/site";
import "blobatar/motion.css";
import "./global.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-sora",
});

const socialImage = {
  url: "/images/og-cover.png",
  width: 1200,
  height: 630,
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    metadataBase: new URL(siteUrl),
    icons: { icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/images/brand-mark.svg", type: "image/svg+xml" }] },
    title: {
      default: t("title"),
      template: "%s | TechToJob",
    },
    description: t("description"),
    alternates: { canonical: "/" },
    openGraph: {
      title: t("socialTitle"),
      description: t("socialDescription"),
      locale: "es_ES",
      siteName: "TechToJob",
      type: "website",
      url: "/",
      images: [{ ...socialImage, alt: t("imageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("socialTitle"),
      description: t("socialDescription"),
      images: [{ ...socialImage, alt: t("imageAlt") }],
    },
  };
}

// "@id": el mismo en la bolsa (techtojob.com/empleo): para Google y los asistentes de IA es una sola organización.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: site.name,
  url: siteUrl,
  logo: `${siteUrl}/images/brand-mark-512.png`,
  description: about.description,
  foundingDate: about.founded,
  founder: { "@type": "Person", name: owner.name },
  knowsLanguage: "es",
  email: site.email,
  sameAs: [site.discord, site.linkedin, site.x, site.instagram, site.tiktok],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: site.name,
  url: siteUrl,
  inLanguage: "es",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${sora.variable} ${sora.className}`}>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        {children}
      </body>
    </html>
  );
}
