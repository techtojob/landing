import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HeaderShell } from "@/components/header-shell";
import { AccountLink } from "@/components/account-link";
import { MobileMenu } from "@/components/mobile-menu";
import { bolsa } from "@/lib/site";

// El menú de TechToJob: el MISMO en la landing y en la bolsa (techtojob.com/empleo, repo techtojob/platform:
// apps/web/src/components/sitio/nav-bolsa.tsx): Ofertas, Talento y Proyectos, que son de la bolsa.
// El logo lleva a esta portada. Torneos, Noticias, Empresas y Quiénes somos no van en el menú:
// se llega desde su sección de la portada ("Ver más") y desde el pie de página.
const navigation = [
  ["offers", bolsa.ofertas],
  ["talentSearch", bolsa.talento],
  ["projects", bolsa.proyectos],
] as const;

type Translate = Awaited<ReturnType<typeof getTranslations>>;

function Navigation({ t, mobile = false }: Readonly<{ t: Translate; mobile?: boolean }>) {
  const linkClass = mobile
    ? "block rounded-xl px-4 py-3 text-base font-bold transition-colors hover:bg-white/8 hover:text-primary"
    : "text-sm font-bold transition-colors hover:text-primary";
  return (
    <ul className={mobile ? "grid min-w-56 gap-1" : "flex items-center gap-7"}>
      {navigation.map(([key, href]) => (
        <li key={key}>
          <a href={href} className={linkClass}>
            {t(`navigation.${key}`)}
          </a>
        </li>
      ))}
    </ul>
  );
}

export async function SiteHeader({ home = true }: Readonly<{ home?: boolean }>) {
  const t = await getTranslations();

  return (
    <header className="sticky inset-x-0 top-0 z-50 px-[var(--page-gutter)]">
      <HeaderShell>
        <a href={home ? "#top" : "/"} className="flex w-fit items-center" aria-label={t("brand.name")}>
          <Image src="/images/brand-logo.svg" alt="" width={140} height={78} className="h-11 w-auto min-[50rem]:h-14" loading="eager" fetchPriority="high" />
        </a>
        <nav className="hidden min-[64rem]:block" aria-label={t("navigation.jobs")}>
          <Navigation t={t} />
        </nav>
        {/* Sin botón de Discord: ya está en la portada (hero, comunidad) y en el pie. */}
        <div className="col-start-3 flex items-center justify-end gap-2">
          {/* Entrar / Mi cuenta, siempre a la vista (también en el móvil), como en la bolsa. */}
          <AccountLink loginLabel={t("navigation.login")} accountLabel={t("navigation.account")} className="inline-flex min-h-11" />
          <MobileMenu label={t("navigation.menu")}>
            <nav aria-label={t("navigation.jobs")}>
              <Navigation t={t} mobile />
            </nav>
          </MobileMenu>
        </div>
      </HeaderShell>
    </header>
  );
}
