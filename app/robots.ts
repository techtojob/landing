import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Este robots.txt vale para todo techtojob.com, también para la bolsa de empleo (techtojob.com/empleo
// y /jobs, repo techtojob/platform), que tiene su propio mapa del sitio.
// No se rastrean sus páginas privadas (cuenta y panel de staff) ni el inicio de sesión (/api/auth).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/empleo/cuenta", "/empleo/staff", "/jobs/account", "/jobs/staff"],
    },
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/empleo/sitemap.xml`],
  };
}
