export const author = {
  name: "Esteban Casadei",
  linkedin: "https://www.linkedin.com/in/esteban-casadei-087553357/",
} as const;

export const discordInviteCode = "pzCa8esFGA";

export const site = {
  name: "TechToJob",
  discord: `https://discord.gg/${discordInviteCode}`,
  linkedin: "https://www.linkedin.com/company/techtojob/",
  x: "https://x.com/techtojob",
  instagram: "https://www.instagram.com/techtojob",
  tiktok: "https://www.tiktok.com/@techtojob",
  email: "contacto@techtojob.com",
  // Dirección pública de la newsletter en Beehiiv, sin barra final
  // (por ejemplo "https://techtojob.beehiiv.com"). Vacío = formulario sin conectar.
  newsletter: "",
} as const;

// Titular de la web: aparece en /aviso-legal y /privacidad.
export const owner = {
  name: "Pablo Pío Ramos",
  // NIF del titular. Mientras esté vacío no se muestra.
  taxId: "51204872H",
  address: "Calle El Calvario, n.º 6, Valle de Guerra, Tenerife (España)",
  email: site.email,
  legalUpdated: "2026-10-10",
  legalUpdatedLabel: "10 de octubre de 2026",
} as const;

// Dominio oficial. Se puede sobrescribir con NEXT_PUBLIC_SITE_URL (por ejemplo, en una preview).
const productionUrl = "https://techtojob.com";

const deploymentUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? productionUrl : "http://localhost:3000");

export const siteUrl = deploymentUrl.replace(/\/+$/, "");

// La bolsa de empleo (techtojob.com/empleo, repo techtojob/platform): el menú lleva a sus páginas.
export const bolsa = {
  ofertas: "/empleo",
  talento: "/empleo/talento",
  proyectos: "/empleo/proyectos",
  entrar: "/empleo/entrar",
  cuenta: "/empleo/cuenta/ajustes",
  oferta: (slug: string, id: string) => `/empleo/ofertas/${slug}-${id}`,
  proyecto: (slug: string, id: string) => `/empleo/proyectos/${slug}-${id}`,
} as const;

// El API de la bolsa: la portada pide ahí las últimas ofertas y los proyectos del mes (desde el navegador).
export const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "https://api.techtojob.com").replace(/\/+$/, "");
