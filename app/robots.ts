import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// La bolsa de empleo (techtojob.com/empleo y /jobs) es otra app con su propio mapa del sitio.
// Sus páginas privadas (cuenta y panel de staff) no se rastrean.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/empleo/staff", "/empleo/cuenta", "/jobs/staff", "/jobs/account"],
    },
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/empleo/sitemap.xml`],
  };
}
