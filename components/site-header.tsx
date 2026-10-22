import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AnimatedButtonLabel } from "@/components/animated-button-label";
import { HeaderShell } from "@/components/header-shell";
import { DiscordMemberLink } from "@/components/discord-member-link";
import { AccountLink } from "@/components/account-link";
import { MobileMenu } from "@/components/mobile-menu";
import { MoreMenu } from "@/components/more-menu";
import { bolsa, site } from "@/lib/site";

// El menú de TechToJob: el MISMO en la landing y en la bolsa (techtojob.com/empleo, repo techtojob/platform:
// apps/web/src/components/sitio/nav-bolsa.tsx), en dos grupos para que se vea a dónde lleva cada cosa:
// - Empleo: Ofertas, Talento y Proyectos (la bolsa).
// - Comunidad ▾: ¿Qué es TechToJob? (esta portada), Torneos, Noticias, Para empresas y Quiénes somos (la landing).
const navigation = [
  ["offers", bolsa.ofertas],
  ["talentSearch", bolsa.talento],
  ["projects", bolsa.proyectos],
] as const;
const community = [
  ["whatIs", "/"],
  ["tournaments", "/torneos"],
  ["news", "/noticias"],
  ["forCompanies", "/empresas"],
  ["about", "/quienes-somos"],
] as const;

type Translate = Awaited<ReturnType<typeof getTranslations>>;

function Navigation({ t, current, mobile = false }: Readonly<{ t: Translate; current?: string; mobile?: boolean }>) {
  if (mobile) {
    const heading = "px-4 pb-1 pt-3 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-white/60";
    const link = (key: string, href: string) => (
      <li key={key}>
        <a href={href} aria-current={current === href ? "page" : undefined} className={`block rounded-xl px-4 py-3 text-base font-bold transition-colors hover:bg-white/8 hover:text-primary ${current === href ? "bg-white/8 text-primary" : ""}`}>
          {t(`navigation.${key}`)}
        </a>
      </li>
    );
    return (
      <div className="grid min-w-56 gap-1">
        <p className={heading}>{t("navigation.groupJobs")}</p>
        <ul className="grid gap-1">{navigation.map(([key, href]) => link(key, href))}</ul>
        <p className={`${heading} mt-1 border-t border-white/10`}>{t("navigation.groupCommunity")}</p>
        <ul className="grid gap-1">{community.map(([key, href]) => link(key, href))}</ul>
      </div>
    );
  }
  return (
    <ul className="flex items-center gap-6">
      {navigation.map(([key, href]) => {
        const active = current === href;
        return (
          <li key={key}>
            <a
              href={href}
              aria-current={active ? "page" : undefined}
              className={`text-sm font-bold transition-colors hover:text-primary ${active ? "text-primary" : ""}`}
            >
              {t(`navigation.${key}`)}
            </a>
          </li>
        );
      })}
      <li aria-hidden="true" className="h-6 w-px bg-white/20" />
      <li>
        <MoreMenu
          label={t("navigation.groupCommunity")}
          heading="techtojob.com"
          current={current}
          items={community.map(([key, href]) => ({ href, label: t(`navigation.${key}`), help: t(`navigation.help.${key}`) }))}
        />
      </li>
    </ul>
  );
}

function DiscordAction({ t, className }: Readonly<{ t: Translate; className: string }>) {
  return (
    <DiscordMemberLink
      className={`group/action relative items-center gap-2 overflow-hidden rounded-full bg-primary px-4 text-sm font-bold text-ink ${className}`}
      label={t("community.joinFull", { count: "{count}" })}
      countLabel={t("community.members", { count: "{count}" })}
      animated
    >
      <Image src="/images/discord-dark.svg" alt="" width={20} height={20} />
    </DiscordMemberLink>
  );
}

export async function SiteHeader({ home = true, current }: Readonly<{ home?: boolean; current?: string }>) {
  const t = await getTranslations();
  // En la portada, "¿Qué es TechToJob?" es la página actual.
  current = home ? "/" : current;

  return (
    <header className="sticky inset-x-0 top-0 z-50 px-[var(--page-gutter)]">
      <HeaderShell>
        <a href={home ? "#top" : "/"} className="flex w-fit items-center" aria-label={t("brand.name")}>
          <Image src="/images/brand-logo.svg" alt="" width={140} height={78} className="h-11 w-auto min-[50rem]:h-14" loading="eager" fetchPriority="high" />
        </a>
        <nav className="hidden min-[64rem]:block" aria-label={t("navigation.community")}>
          <Navigation t={t} current={current} />
        </nav>
        <DiscordAction t={t} className="inline-flex min-h-11 justify-self-center min-[64rem]:hidden" />
        <div className="flex items-center justify-end gap-2">
          <DiscordAction t={t} className="hidden min-h-11 min-[76rem]:inline-flex" />
          <AccountLink loginLabel={t("navigation.login")} accountLabel={t("navigation.account")} className="hidden min-h-11 min-[64rem]:inline-flex" />
          <MobileMenu label={t("navigation.menu")}>
            <nav aria-label={t("navigation.community")}>
              <Navigation t={t} current={current} mobile />
              <AccountLink loginLabel={t("navigation.login")} accountLabel={t("navigation.account")} className="mt-2 flex min-h-11 justify-center" />
              <a className="group/action relative mt-2 flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 font-bold text-ink" href={site.discord}>
                <Image src="/images/discord-dark.svg" alt="" width={20} height={20} />
                <AnimatedButtonLabel text={t("community.join")} />
              </a>
            </nav>
          </MobileMenu>
        </div>
      </HeaderShell>
    </header>
  );
}
